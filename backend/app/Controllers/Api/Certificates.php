<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\CertificatesModel;
use CodeIgniter\HTTP\ResponseInterface;

class Certificates extends BaseController
{
    private CertificatesModel $model;

    public function __construct()
    {
        $this->model = new CertificatesModel();
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
        $cert = $this->model->find($id);
        if (!$cert) return $this->response->setStatusCode(404)->setJSON(['error' => 'Certificate not found.']);
        return $this->response->setJSON(['data' => $cert]);
    }

    public function create(): ResponseInterface
    {
        helper('file');

        $data  = $this->request->getPost() ?: ($this->request->getJSON(true) ?? []);
        $title = trim($data['title'] ?? '');
        if (!$title) return $this->response->setStatusCode(422)->setJSON(['error' => 'Title is required.']);

        $now    = date('Y-m-d H:i:s');
        $imgUrl = '';

        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $result = upload_file($_FILES['image'], 'certificates');
            if (!isset($result['error'])) $imgUrl = $result['path'];
        }

        $id = $this->model->insert([
            'title'       => $title,
            'description' => $data['description'] ?? '',
            'image_url'   => $imgUrl,
            'sort_order'  => (int)($data['sort_order'] ?? 0),
            'is_active'   => (int)($data['is_active'] ?? 1),
            'created_at'  => $now,
            'updated_at'  => $now,
        ]);

        return $this->response->setStatusCode(201)->setJSON(['data' => $this->model->find($id)]);
    }

    public function update(int $id): ResponseInterface
    {
        helper('file');

        $cert = $this->model->find($id);
        if (!$cert) return $this->response->setStatusCode(404)->setJSON(['error' => 'Certificate not found.']);

        $data   = $this->request->getPost() ?: ($this->request->getJSON(true) ?? []);
        $update = ['updated_at' => date('Y-m-d H:i:s')];

        foreach (['title', 'description', 'sort_order', 'is_active'] as $field) {
            if (isset($data[$field])) $update[$field] = $data[$field];
        }

        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $result = upload_file($_FILES['image'], 'certificates');
            if (!isset($result['error'])) {
                remove_file($cert['image_url'], 'certificates');
                $update['image_url'] = $result['path'];
            }
        }

        $this->model->update($id, $update);
        return $this->response->setJSON(['data' => $this->model->find($id)]);
    }

    public function delete(int $id): ResponseInterface
    {
        $cert = $this->model->find($id);
        if (!$cert) return $this->response->setStatusCode(404)->setJSON(['error' => 'Certificate not found.']);
        helper('file');
        remove_file($cert['image_url'], 'certificates');
        $this->model->delete($id);
        return $this->response->setJSON(['id' => $id, 'message' => 'Certificate deleted.']);
    }
}
