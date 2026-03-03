<?php

namespace App\Controllers;

use App\Models\UsersModel;
use CodeIgniter\HTTP\ResponseInterface;

class Auth extends BaseController
{
    public function login(): ResponseInterface
    {
        helper('jwt');

        $data = $this->request->getJSON(true) ?? [];

        $email    = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';

        if (!$email || !$password) {
            return $this->response->setStatusCode(422)->setJSON(['error' => 'Email and password are required.']);
        }

        $model = new UsersModel();
        $user  = $model->findByEmail($email);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            return $this->response->setStatusCode(401)->setJSON(['error' => 'Invalid credentials.']);
        }

        $ttl   = (int) env('JWT_TTL', 21600);
        $token = jwt_issue([
            'id'    => $user['id'],
            'email' => $user['email'],
            'role'  => $user['role'],
        ]);

        return $this->response->setJSON([
            'token'      => $token,
            'expires_in' => $ttl,
            'user'       => [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'role'  => $user['role'],
            ],
        ]);
    }
}
