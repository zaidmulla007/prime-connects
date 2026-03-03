<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UsersModel;
use CodeIgniter\HTTP\ResponseInterface;

class Me extends BaseController
{
    private UsersModel $model;

    public function __construct()
    {
        $this->model = new UsersModel();
    }

    public function show(): ResponseInterface
    {
        $user = $this->model->find($this->request->user['sub']);
        if (!$user) return $this->response->setStatusCode(404)->setJSON(['error' => 'User not found.']);
        unset($user['password_hash']);
        return $this->response->setJSON(['data' => $user]);
    }

    public function update(): ResponseInterface
    {
        $data   = $this->request->getJSON(true) ?? [];
        $userId = $this->request->user['sub'];
        $user   = $this->model->find($userId);
        if (!$user) return $this->response->setStatusCode(404)->setJSON(['error' => 'User not found.']);

        $update = ['updated_at' => date('Y-m-d H:i:s')];
        if (!empty($data['name']))  $update['name']  = trim($data['name']);
        if (!empty($data['email'])) $update['email'] = trim($data['email']);

        $this->model->update($userId, $update);
        $user = $this->model->find($userId);
        unset($user['password_hash']);
        return $this->response->setJSON(['data' => $user]);
    }

    public function changePassword(): ResponseInterface
    {
        $data     = $this->request->getJSON(true) ?? [];
        $userId   = $this->request->user['sub'];
        $user     = $this->model->find($userId);
        if (!$user) return $this->response->setStatusCode(404)->setJSON(['error' => 'User not found.']);

        $current  = $data['current_password'] ?? '';
        $newPass  = $data['new_password'] ?? '';

        if (!$current || !$newPass) {
            return $this->response->setStatusCode(422)->setJSON(['error' => 'current_password and new_password are required.']);
        }

        if (!password_verify($current, $user['password_hash'])) {
            return $this->response->setStatusCode(401)->setJSON(['error' => 'Current password is incorrect.']);
        }

        if (strlen($newPass) < 6) {
            return $this->response->setStatusCode(422)->setJSON(['error' => 'New password must be at least 6 characters.']);
        }

        $this->model->update($userId, [
            'password_hash' => password_hash($newPass, PASSWORD_BCRYPT),
            'updated_at'    => date('Y-m-d H:i:s'),
        ]);

        return $this->response->setJSON(['message' => 'Password changed successfully.']);
    }
}
