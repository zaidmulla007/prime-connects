<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\BannersModel;
use CodeIgniter\HTTP\ResponseInterface;

class Banners extends BaseController
{
    private BannersModel $model;

    public function __construct()
    {
        $this->model = new BannersModel();
    }

    public function index(): ResponseInterface
    {
        $page    = max(1, (int)($this->request->getGet('page') ?? 1));
        $perPage = max(1, (int)($this->request->getGet('per_page') ?? 20));
        $result  = $this->model->paginated($page, $perPage);
        return $this->response->setJSON([
            'data' => $result['data'],
            'meta' => ['total' => $result['total'], 'page' => $page, 'per_page' => $perPage],
        ]);
    }

    public function show(int $id): ResponseInterface
    {
        $banner = $this->model->find($id);
        if (!$banner) return $this->response->setStatusCode(404)->setJSON(['error' => 'Banner not found.']);
        return $this->response->setJSON(['data' => $banner]);
    }

    public function create(): ResponseInterface
    {
        helper('file');

        $data   = $this->request->getPost();
        $now    = date('Y-m-d H:i:s');
        $imgUrl = '';

        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $result = upload_file($_FILES['image'], 'banners');
            if (isset($result['error'])) {
                return $this->response->setStatusCode(422)->setJSON(['error' => $result['error']]);
            }
            $imgUrl = $result['path'];
        } else {
            $jsonData = $this->request->getJSON(true) ?? [];
            $imgUrl   = $jsonData['image_url'] ?? '';
        }

        if (!$imgUrl) return $this->response->setStatusCode(422)->setJSON(['error' => 'Banner image is required.']);

        $id = $this->model->insert([
            'image_url'    => $imgUrl,
            'title'        => $data['title'] ?? '',
            'subtitle'     => $data['subtitle'] ?? '',
            'link_url'     => $data['link_url'] ?? '',
            'is_permanent' => (int)($data['is_permanent'] ?? 1),
            'from_date'    => $data['from_date'] ?? null,
            'to_date'      => $data['to_date'] ?? null,
            'is_active'    => (int)($data['is_active'] ?? 1),
            'sort_order'   => (int)($data['sort_order'] ?? 0),
            'created_at'   => $now,
            'updated_at'   => $now,
        ]);

        return $this->response->setStatusCode(201)->setJSON(['data' => $this->model->find($id)]);
    }

    public function update(int $id): ResponseInterface
    {
        helper('file');

        $banner = $this->model->find($id);
        if (!$banner) return $this->response->setStatusCode(404)->setJSON(['error' => 'Banner not found.']);

        $data   = $this->request->getPost() ?: ($this->request->getJSON(true) ?? []);
        $update = ['updated_at' => date('Y-m-d H:i:s')];

        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $result = upload_file($_FILES['image'], 'banners');
            if (!isset($result['error'])) {
                remove_file($banner['image_url'], 'banners');
                $update['image_url'] = $result['path'];
            }
        }

        foreach (['title', 'subtitle', 'link_url', 'is_permanent', 'from_date', 'to_date', 'is_active', 'sort_order'] as $field) {
            if (isset($data[$field])) $update[$field] = $data[$field];
        }

        $this->model->update($id, $update);
        return $this->response->setJSON(['data' => $this->model->find($id)]);
    }

    public function delete(int $id): ResponseInterface
    {
        $banner = $this->model->find($id);
        if (!$banner) return $this->response->setStatusCode(404)->setJSON(['error' => 'Banner not found.']);
        helper('file');
        remove_file($banner['image_url'], 'banners');
        $this->model->delete($id);
        return $this->response->setJSON(['id' => $id, 'message' => 'Banner deleted.']);
    }
}
