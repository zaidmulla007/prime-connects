<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class JwtAuth implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // Allow CORS preflight
        if ($request->getMethod() === 'options') {
            return null;
        }

        helper('jwt');

        $header = $request->getHeaderLine('Authorization');

        if (empty($header) || !str_starts_with($header, 'Bearer ')) {
            return \Config\Services::response()
                ->setStatusCode(401)
                ->setJSON(['error' => 'No token provided.']);
        }

        $token = substr($header, 7);

        try {
            $payload = jwt_decode_token($token);
            $request->user = $payload;
        } catch (\Throwable $e) {
            return \Config\Services::response()
                ->setStatusCode(401)
                ->setJSON(['error' => 'Invalid or expired token.']);
        }

        return null;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        return null;
    }
}
