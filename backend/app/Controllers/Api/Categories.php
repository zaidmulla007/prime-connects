<?php

namespace App\Controllers\Api;

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

    public function index(): ResponseInterface
    {
        $flat = $this->request->getGet('flat');
        if ($flat === '1') {
            return $this->response->setJSON(['data' => $this->model->getFlat()]);
        }
        return $this->response->setJSON(['data' => $this->model->getTree()]);
    }

    public function show(int $id): ResponseInterface
    {
        $cat = $this->model->find($id);
        if (!$cat) return $this->response->setStatusCode(404)->setJSON(['error' => 'Category not found.']);
        $cat['children'] = $this->model->childrenOf($id);
        return $this->response->setJSON(['data' => $cat]);
    }

    public function create(): ResponseInterface
    {
        helper(['slugify', 'file']);

        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        $name = trim($data['name'] ?? '');
        if (!$name) return $this->response->setStatusCode(422)->setJSON(['error' => 'Category name is required.']);

        $parentId = !empty($data['parent_id']) ? (int)$data['parent_id'] : null;
        $parent   = $parentId ? $this->model->find($parentId) : null;
        $depth    = $parent ? ((int)$parent['depth'] + 1) : 0;

        $now  = date('Y-m-d H:i:s');
        $slug = generate_unique_slug($name, 'categories');

        $id = $this->model->insert([
            'name'        => $name,
            'slug'        => $slug,
            'description' => $data['description'] ?? '',
            'parent_id'   => $parentId,
            'type'        => $data['type'] ?? 'category',
            'sort_order'  => (int)($data['sort_order'] ?? 0),
            'depth'       => $depth,
            'path'        => '0',
            'created_at'  => $now,
            'updated_at'  => $now,
        ]);

        // Handle file upload
        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $result = upload_file($_FILES['image'], 'categories');
            if (!isset($result['error'])) {
                $this->model->update($id, ['image_url' => $result['path']]);
            }
        }

        $cat = $this->model->find($id);
        $this->model->updatePathDepth($id, $parentId, $parent ? $parent['path'] : '', $depth);

        return $this->response->setStatusCode(201)->setJSON(['data' => $this->model->find($id)]);
    }

    public function update(int $id): ResponseInterface
    {
        helper(['slugify', 'file']);

        $cat = $this->model->find($id);
        if (!$cat) return $this->response->setStatusCode(404)->setJSON(['error' => 'Category not found.']);

        $data   = $this->request->getJSON(true) ?? $this->request->getPost();
        $update = ['updated_at' => date('Y-m-d H:i:s')];

        if (isset($data['name']))        $update['name']        = $data['name'];
        if (isset($data['description'])) $update['description'] = $data['description'];
        if (isset($data['type']))        $update['type']        = $data['type'];
        if (isset($data['sort_order']))  $update['sort_order']  = (int)$data['sort_order'];
        if (array_key_exists('parent_id', $data)) {
            $update['parent_id'] = $data['parent_id'] ? (int)$data['parent_id'] : null;
        }

        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $result = upload_file($_FILES['image'], 'categories');
            if (!isset($result['error'])) {
                $update['image_url'] = $result['path'];
            }
        }

        $this->model->update($id, $update);

        $parentId = $update['parent_id'] ?? $cat['parent_id'];
        $parent   = $parentId ? $this->model->find($parentId) : null;
        $depth    = $parent ? ((int)$parent['depth'] + 1) : 0;
        $this->model->updatePathDepth($id, $parentId, $parent ? $parent['path'] : '', $depth);

        return $this->response->setJSON(['data' => $this->model->find($id)]);
    }

    public function delete(int $id): ResponseInterface
    {
        if (!$this->model->find($id)) return $this->response->setStatusCode(404)->setJSON(['error' => 'Category not found.']);
        $this->model->delete($id);
        return $this->response->setJSON(['id' => $id, 'message' => 'Category deleted.']);
    }

    public function reorder(int $id): ResponseInterface
    {
        $data = $this->request->getJSON(true) ?? [];
        $this->model->update($id, ['sort_order' => (int)($data['sort_order'] ?? 0)]);
        return $this->response->setJSON(['message' => 'Updated.']);
    }
}
