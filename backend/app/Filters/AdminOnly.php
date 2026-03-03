<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class AdminOnly implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        if ($request->getMethod() === 'options') {
            return null;
        }

        $user = $request->user ?? null;

        if (!$user || ($user['role'] ?? '') !== 'admin') {
            return \Config\Services::response()
                ->setStatusCode(403)
                ->setJSON(['error' => 'Admin access required.']);
        }

        return null;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        return null;
    }
}
