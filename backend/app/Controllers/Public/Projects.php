<?php

namespace App\Controllers\Public;

use App\Controllers\BaseController;
use App\Models\ProjectsModel;
use CodeIgniter\HTTP\ResponseInterface;

class Projects extends BaseController
{
    /**
     * GET /api/public/projects
     */
    public function index(): ResponseInterface
    {
        $model = new ProjectsModel();
        $page    = max(1, (int) ($this->request->getGet('page') ?? 1));
        $perPage = min(48, max(1, (int) ($this->request->getGet('per_page') ?? 12)));

        $result = $model->paginated($page, $perPage, null, true);

        return $this->response->setJSON([
            'data' => $result['data'],
            'meta' => [
                'total'    => $result['total'],
                'page'     => $page,
                'per_page' => $perPage,
                'pages'    => max(1, (int) ceil($result['total'] / $perPage)),
            ],
        ]);
    }
}
