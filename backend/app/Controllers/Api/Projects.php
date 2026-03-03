<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\ProjectsModel;
use CodeIgniter\HTTP\ResponseInterface;

class Projects extends BaseController
{
    private ProjectsModel $model;

    public function __construct()
    {
        $this->model = new ProjectsModel();
    }

    public function index(): ResponseInterface
    {
        $page    = max(1, (int)($this->request->getGet('page') ?? 1));
        $perPage = max(1, (int)($this->request->getGet('per_page') ?? 12));
        $q       = $this->request->getGet('q') ?: null;
        $result  = $this->model->paginated($page, $perPage, $q);
        return $this->response->setJSON([
            'data' => $result['data'],
            'meta' => ['total' => $result['total'], 'page' => $page, 'per_page' => $perPage],
        ]);
    }

    public function show(int $id): ResponseInterface
    {
        $project = $this->model->find($id);
        if (!$project) return $this->response->setStatusCode(404)->setJSON(['error' => 'Project not found.']);
        return $this->response->setJSON(['data' => $project]);
    }

    public function create(): ResponseInterface
    {
        helper(['slugify', 'file']);

        $data = $this->request->getPost() ?: ($this->request->getJSON(true) ?? []);
        $title = trim($data['title'] ?? '');
        if (!$title) return $this->response->setStatusCode(422)->setJSON(['error' => 'Title is required.']);

        $now    = date('Y-m-d H:i:s');
        $slug   = generate_unique_slug($title, 'projects');
        $imgUrl = '';

        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $result = upload_file($_FILES['image'], 'projects');
            if (!isset($result['error'])) $imgUrl = $result['path'];
        }

        $id = $this->model->insert([
            'title'       => $title,
            'slug'        => $slug,
            'description' => $data['description'] ?? '',
            'image_url'   => $imgUrl,
            'location'    => $data['location'] ?? '',
            'year'        => $data['year'] ?? '',
            'sort_order'  => (int)($data['sort_order'] ?? 0),
            'is_active'   => (int)($data['is_active'] ?? 1),
            'created_at'  => $now,
            'updated_at'  => $now,
        ]);

        return $this->response->setStatusCode(201)->setJSON(['data' => $this->model->find($id)]);
    }

    public function update(int $id): ResponseInterface
    {
        helper(['file']);

        $project = $this->model->find($id);
        if (!$project) return $this->response->setStatusCode(404)->setJSON(['error' => 'Project not found.']);

        $data   = $this->request->getPost() ?: ($this->request->getJSON(true) ?? []);
        $update = ['updated_at' => date('Y-m-d H:i:s')];

        foreach (['title', 'description', 'location', 'year', 'sort_order', 'is_active'] as $field) {
            if (isset($data[$field])) $update[$field] = $data[$field];
        }

        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $result = upload_file($_FILES['image'], 'projects');
            if (!isset($result['error'])) {
                remove_file($project['image_url'], 'projects');
                $update['image_url'] = $result['path'];
            }
        }

        $this->model->update($id, $update);
        return $this->response->setJSON(['data' => $this->model->find($id)]);
    }

    public function delete(int $id): ResponseInterface
    {
        $project = $this->model->find($id);
        if (!$project) return $this->response->setStatusCode(404)->setJSON(['error' => 'Project not found.']);
        helper('file');
        remove_file($project['image_url'], 'projects');
        $this->model->delete($id);
        return $this->response->setJSON(['id' => $id, 'message' => 'Project deleted.']);
    }
}
