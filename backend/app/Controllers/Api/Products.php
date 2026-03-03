<?php

namespace App\Controllers\Api;

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

    public function index(): ResponseInterface
    {
        $page    = max(1, (int) ($this->request->getGet('page') ?? 1));
        $perPage = min(48, max(1, (int) ($this->request->getGet('per_page') ?? 12)));
        $q       = $this->request->getGet('q') ?: null;
        $catId   = $this->request->getGet('category_id') ? (int)$this->request->getGet('category_id') : null;

        $result = $this->model->paginated($page, $perPage, $q, $catId);

        // Attach first image
        $db = \Config\Database::connect();
        foreach ($result['data'] as &$p) {
            $img = $db->table('product_images')
                ->where('product_id', $p['id'])
                ->orderBy('sort_order', 'ASC')->limit(1)->get()->getRowArray();
            $p['image'] = $img['url'] ?? null;
        }

        return $this->response->setJSON([
            'data' => $result['data'],
            'meta' => [
                'total'    => $result['total'],
                'page'     => $page,
                'per_page' => $perPage,
                'pages'    => max(1, (int) ceil($result['total'] / $perPage)),
            ],
        ]);
    }

    public function show(int $id): ResponseInterface
    {
        $product = $this->model->withOnlyTrashed()->find($id) ?? $this->model->find($id);
        if (!$product) return $this->response->setStatusCode(404)->setJSON(['error' => 'Product not found.']);
        return $this->response->setJSON(['data' => $this->model->withImagesAndSpecs($product)]);
    }

    public function create(): ResponseInterface
    {
        helper('slugify');
        $data = $this->request->getJSON(true) ?? [];

        $name = trim($data['name'] ?? '');
        if (!$name) return $this->response->setStatusCode(422)->setJSON(['error' => 'Product name is required.']);

        $now  = date('Y-m-d H:i:s');
        $slug = generate_unique_slug($name, 'products');

        $id = $this->model->insert([
            'name'        => $name,
            'slug'        => $slug,
            'sku'         => $data['sku'] ?? null,
            'description' => $data['description'] ?? null,
            'category_id' => $data['category_id'] ?? null,
            'is_active'   => $data['is_active'] ?? 1,
            'meta'        => isset($data['meta']) ? json_encode($data['meta']) : null,
            'created_at'  => $now,
            'updated_at'  => $now,
        ]);

        $product = $this->model->withImagesAndSpecs($this->model->find($id));
        return $this->response->setStatusCode(201)->setJSON(['data' => $product]);
    }

    public function update(int $id): ResponseInterface
    {
        $product = $this->model->find($id);
        if (!$product) return $this->response->setStatusCode(404)->setJSON(['error' => 'Product not found.']);

        $data   = $this->request->getJSON(true) ?? [];
        $update = ['updated_at' => date('Y-m-d H:i:s')];

        if (isset($data['name']))        $update['name']        = $data['name'];
        if (isset($data['sku']))         $update['sku']         = $data['sku'];
        if (isset($data['description'])) $update['description'] = $data['description'];
        if (isset($data['category_id'])) $update['category_id'] = $data['category_id'];
        if (isset($data['is_active']))   $update['is_active']   = $data['is_active'];
        if (isset($data['meta']))        $update['meta']        = json_encode($data['meta']);

        $this->model->update($id, $update);
        return $this->response->setJSON(['data' => $this->model->withImagesAndSpecs($this->model->find($id))]);
    }

    public function delete(int $id): ResponseInterface
    {
        $product = $this->model->find($id);
        if (!$product) return $this->response->setStatusCode(404)->setJSON(['error' => 'Product not found.']);
        $this->model->delete($id);
        return $this->response->setJSON(['id' => $id, 'message' => 'Product deleted.']);
    }
}
