<?php

namespace App\Controllers;

use CodeIgniter\HTTP\ResponseInterface;

class Preflight extends BaseController
{
    public function handle(): ResponseInterface
    {
        return $this->response
            ->setStatusCode(204)
            ->setHeader('Access-Control-Allow-Origin', '*')
            ->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
            ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept')
            ->setHeader('Access-Control-Max-Age', '7200');
    }
}
