<?php

namespace App\Controllers\Public;

use App\Controllers\BaseController;
use App\Models\ProductsModel;
use CodeIgniter\HTTP\ResponseInterface;

class Products extends BaseController
{
    private ProductsModel $model;

    public function __construct()
    {
        $this->model = new ProductsModel();
    }

    /**
     * GET /api/public/products
     * Params: page, per_page, q, category_id, category_slug
     */
    public function index(): ResponseInterface
    {
        $page     = max(1, (int) ($this->request->getGet('page') ?? 1));
        $perPage  = min(500, max(1, (int) ($this->request->getGet('per_page') ?? 12)));
        $q        = $this->request->getGet('q') ?: null;
        $catId    = $this->request->getGet('category_id') ?: null;
        $catSlug  = $this->request->getGet('category') ?: null;

        // Resolve category slug → id
        if ($catSlug && !$catId) {
            $db  = \Config\Database::connect();
            $cat = $db->table('categories')->where('slug', $catSlug)->get()->getRowArray();
            if ($cat) {
                $catId = $cat['id'];
                // Include descendants
                $catIds = $this->getDescendantIds((int)$catId);
                $catIds[] = (int)$catId;
                $catId = $catIds;
            }
        }

        $result = $this->model->paginated($page, $perPage, $q, is_array($catId) ? null : ($catId ? (int)$catId : null));

        // If we have array of cat IDs, apply manually
        if (is_array($catId)) {
            $products = $this->model->whereIn('category_id', $catId)
                ->orderBy('created_at', 'DESC')
                ->findAll($perPage, ($page - 1) * $perPage);
            $total = $this->model->whereIn('category_id', $catId)->countAllResults();
            $result = ['data' => $products, 'total' => $total];
        }

        // Enrich with first image
        $db = \Config\Database::connect();
        $enriched = [];
        foreach ($result['data'] as $p) {
            $img = $db->table('product_images')
                ->where('product_id', $p['id'])
                ->orderBy('sort_order', 'ASC')
                ->limit(1)->get()->getRowArray();
            $p['image'] = $img['url'] ?? null;
            $enriched[] = $p;
        }

        return $this->response->setJSON([
            'data' => $enriched,
            'meta' => [
                'total'    => $result['total'],
                'page'     => $page,
                'per_page' => $perPage,
                'pages'    => max(1, (int) ceil($result['total'] / $perPage)),
            ],
        ]);
    }

    /**
     * GET /api/public/products/slug/{slug}
     */
    public function showBySlug(string $slug): ResponseInterface
    {
        $product = $this->model->findBySlug($slug);

        if (!$product || $product['deleted_at'] !== null) {
            return $this->response->setStatusCode(404)->setJSON(['error' => 'Product not found.']);
        }

        $enriched = $this->model->withImagesAndSpecs($product);

        return $this->response->setJSON(['data' => $enriched]);
    }

    /**
     * Get all descendant category IDs (for category filter).
     */
    private function getDescendantIds(int $parentId): array
    {
        $db   = \Config\Database::connect();
        $ids  = [];
        $queue = [$parentId];

        while ($queue) {
            $current = array_shift($queue);
            $children = $db->table('categories')->where('parent_id', $current)->get()->getResultArray();
            foreach ($children as $child) {
                $ids[]   = (int)$child['id'];
                $queue[] = (int)$child['id'];
            }
        }

        return $ids;
    }
}
