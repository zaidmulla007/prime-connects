<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\InquiriesModel;
use CodeIgniter\HTTP\ResponseInterface;

class Inquiries extends BaseController
{
    private InquiriesModel $model;

    public function __construct()
    {
        $this->model = new InquiriesModel();
    }

    public function index(): ResponseInterface
    {
        $page     = max(1, (int)($this->request->getGet('page') ?? 1));
        $perPage  = max(1, (int)($this->request->getGet('per_page') ?? 20));
        $q        = $this->request->getGet('q') ?: null;
        $formType = $this->request->getGet('form_type') ?: null;

        $result = $this->model->paginated($page, $perPage, $q, $formType);
        return $this->response->setJSON([
            'data' => $result['data'],
            'meta' => ['total' => $result['total'], 'page' => $page, 'per_page' => $perPage],
        ]);
    }

    public function show(int $id): ResponseInterface
    {
        $inquiry = $this->model->find($id);
        if (!$inquiry) return $this->response->setStatusCode(404)->setJSON(['error' => 'Inquiry not found.']);
        return $this->response->setJSON(['data' => $inquiry]);
    }

    public function markRead(int $id): ResponseInterface
    {
        $inquiry = $this->model->find($id);
        if (!$inquiry) return $this->response->setStatusCode(404)->setJSON(['error' => 'Inquiry not found.']);
        $this->model->update($id, ['is_read' => 1]);
        return $this->response->setJSON(['message' => 'Marked as read.']);
    }

    public function delete(int $id): ResponseInterface
    {
        $inquiry = $this->model->find($id);
        if (!$inquiry) return $this->response->setStatusCode(404)->setJSON(['error' => 'Inquiry not found.']);
        $this->model->delete($id);
        return $this->response->setJSON(['id' => $id, 'message' => 'Inquiry deleted.']);
    }
}
