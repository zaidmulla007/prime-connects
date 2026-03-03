<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UsersModel;
use CodeIgniter\HTTP\ResponseInterface;

class Users extends BaseController
{
    private UsersModel $model;

    public function __construct()
    {
        $this->model = new UsersModel();
    }

    public function index(): ResponseInterface
    {
        $page    = max(1, (int) ($this->request->getGet('page') ?? 1));
        $perPage = max(1, (int) ($this->request->getGet('per_page') ?? 20));
        $q       = $this->request->getGet('q') ?: null;

        $result = $this->model->paginated($page, $perPage, $q);
        foreach ($result['data'] as &$u) unset($u['password_hash']);

        return $this->response->setJSON([
            'data' => $result['data'],
            'meta' => ['total' => $result['total'], 'page' => $page, 'per_page' => $perPage],
        ]);
    }

    public function show(int $id): ResponseInterface
    {
        $user = $this->model->find($id);
        if (!$user) return $this->response->setStatusCode(404)->setJSON(['error' => 'User not found.']);
        unset($user['password_hash']);
        return $this->response->setJSON(['data' => $user]);
    }

    public function create(): ResponseInterface
    {
        $data     = $this->request->getJSON(true) ?? [];
        $name     = trim($data['name'] ?? '');
        $email    = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';
        $role     = in_array($data['role'] ?? '', ['admin', 'editor']) ? $data['role'] : 'editor';

        if (!$name || !$email || !$password) {
            return $this->response->setStatusCode(422)->setJSON(['error' => 'Name, email, and password are required.']);
        }
        if ($this->model->findByEmail($email)) {
            return $this->response->setStatusCode(409)->setJSON(['error' => 'Email already exists.']);
        }

        $id = $this->model->createAdmin(['name' => $name, 'email' => $email, 'password' => $password, 'role' => $role]);
        $user = $this->model->find($id);
        unset($user['password_hash']);
        return $this->response->setStatusCode(201)->setJSON(['data' => $user]);
    }

    public function update(int $id): ResponseInterface
    {
        $user = $this->model->find($id);
        if (!$user) return $this->response->setStatusCode(404)->setJSON(['error' => 'User not found.']);

        $data   = $this->request->getJSON(true) ?? [];
        $update = ['updated_at' => date('Y-m-d H:i:s')];
        if (isset($data['name']))  $update['name']  = trim($data['name']);
        if (isset($data['email'])) $update['email'] = trim($data['email']);
        if (isset($data['role']) && in_array($data['role'], ['admin', 'editor'])) {
            $update['role'] = $data['role'];
        }
        if (!empty($data['password'])) {
            $update['password_hash'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }

        $this->model->update($id, $update);
        $user = $this->model->find($id);
        unset($user['password_hash']);
        return $this->response->setJSON(['data' => $user]);
    }

    public function delete(int $id): ResponseInterface
    {
        $user = $this->model->find($id);
        if (!$user) return $this->response->setStatusCode(404)->setJSON(['error' => 'User not found.']);

        // Prevent deleting own account
        if ($id == $this->request->user['sub']) {
            return $this->response->setStatusCode(422)->setJSON(['error' => 'Cannot delete your own account.']);
        }

        $this->model->delete($id);
        return $this->response->setJSON(['id' => $id, 'message' => 'User deleted.']);
    }
}
