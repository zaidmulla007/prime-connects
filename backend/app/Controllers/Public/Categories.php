<?php

namespace App\Controllers\Public;

use App\Controllers\BaseController;
use App\Models\CategoriesModel;
use CodeIgniter\HTTP\ResponseInterface;

class Categories extends BaseController
{
    private CategoriesModel $model;

    public function __construct()
    {
        $this->model = new CategoriesModel();
    }

    /**
     * GET /api/public/categories
     * Params: flat=0|1
     */
    public function index(): ResponseInterface
    {
        $flat = $this->request->getGet('flat');

        if ($flat === '1' || $flat === 'true') {
            $data = $this->model->getFlat();
            return $this->response->setJSON(['data' => $data]);
        }

        $tree = $this->model->getTree();
        return $this->response->setJSON(['data' => $tree]);
    }

    /**
     * GET /api/public/categories/slug/{slug}
     */
    public function showBySlug(string $slug): ResponseInterface
    {
        $category = $this->model->findBySlug($slug);

        if (!$category) {
            return $this->response->setStatusCode(404)->setJSON(['error' => 'Category not found.']);
        }

        $category['children'] = $this->model->childrenOf((int)$category['id']);

        return $this->response->setJSON(['data' => $category]);
    }
}
