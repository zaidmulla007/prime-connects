<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\ProjectVideosModel;
use CodeIgniter\HTTP\ResponseInterface;

class ProjectVideos extends BaseController
{
    private ProjectVideosModel $model;

    public function __construct()
    {
        $this->model = new ProjectVideosModel();
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
        $video = $this->model->find($id);
        if (!$video) return $this->response->setStatusCode(404)->setJSON(['error' => 'Not found.']);
        return $this->response->setJSON(['data' => $video]);
    }

    public function create(): ResponseInterface
    {
        helper('file');

        $title = trim($this->request->getPost('title') ?? '');
        if (!$title) return $this->response->setStatusCode(422)->setJSON(['error' => 'Title is required.']);

        if (!isset($_FILES['video']) || $_FILES['video']['error'] !== 0) {
            return $this->response->setStatusCode(422)->setJSON(['error' => 'Video file is required.']);
        }

        $result = upload_file($_FILES['video'], 'project-videos');
        if (isset($result['error'])) {
            return $this->response->setStatusCode(422)->setJSON(['error' => $result['error']]);
        }

        $thumbUrl = '';
        if (isset($_FILES['thumbnail']) && $_FILES['thumbnail']['error'] === 0) {
            $tr = upload_file($_FILES['thumbnail'], 'project-videos');
            if (!isset($tr['error'])) $thumbUrl = $tr['path'];
        }

        $now = date('Y-m-d H:i:s');
        $id  = $this->model->insert([
            'title'         => $title,
            'video_url'     => $result['path'],
            'thumbnail_url' => $thumbUrl,
            'sort_order'    => (int)($this->request->getPost('sort_order') ?? 0),
            'is_active'     => 1,
            'created_at'    => $now,
            'updated_at'    => $now,
        ]);

        return $this->response->setStatusCode(201)->setJSON(['data' => $this->model->find($id)]);
    }

    public function update(int $id): ResponseInterface
    {
        helper('file');

        $video = $this->model->find($id);
        if (!$video) return $this->response->setStatusCode(404)->setJSON(['error' => 'Not found.']);

        $data   = $this->request->getPost() ?: ($this->request->getJSON(true) ?? []);
        $update = ['updated_at' => date('Y-m-d H:i:s')];

        foreach (['title', 'sort_order', 'is_active'] as $field) {
            if (isset($data[$field])) $update[$field] = $data[$field];
        }

        if (isset($_FILES['video']) && $_FILES['video']['error'] === 0) {
            $result = upload_file($_FILES['video'], 'project-videos');
            if (!isset($result['error'])) {
                remove_file($video['video_url'], 'project-videos');
                $update['video_url'] = $result['path'];
            }
        }

        if (isset($_FILES['thumbnail']) && $_FILES['thumbnail']['error'] === 0) {
            $tr = upload_file($_FILES['thumbnail'], 'project-videos');
            if (!isset($tr['error'])) {
                remove_file($video['thumbnail_url'], 'project-videos');
                $update['thumbnail_url'] = $tr['path'];
            }
        }

        $this->model->update($id, $update);
        return $this->response->setJSON(['data' => $this->model->find($id)]);
    }

    public function delete(int $id): ResponseInterface
    {
        $video = $this->model->find($id);
        if (!$video) return $this->response->setStatusCode(404)->setJSON(['error' => 'Not found.']);
        helper('file');
        remove_file($video['video_url'], 'project-videos');
        remove_file($video['thumbnail_url'], 'project-videos');
        $this->model->delete($id);
        return $this->response->setJSON(['id' => $id, 'message' => 'Deleted.']);
    }
}
