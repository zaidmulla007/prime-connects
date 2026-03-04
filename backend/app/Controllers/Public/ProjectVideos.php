<?php

namespace App\Controllers\Public;

use App\Controllers\BaseController;
use App\Models\ProjectVideosModel;
use CodeIgniter\HTTP\ResponseInterface;

class ProjectVideos extends BaseController
{
    /**
     * GET /api/public/project-videos
     */
    public function index(): ResponseInterface
    {
        $model   = new ProjectVideosModel();
        $page    = max(1, (int) ($this->request->getGet('page') ?? 1));
        $perPage = min(48, max(1, (int) ($this->request->getGet('per_page') ?? 48)));

        $result = $model->paginated($page, $perPage, null, true);

        return $this->response->setJSON([
            'data' => $result['data'],
            'meta' => [
                'total'    => $result['total'],
                'page'     => $page,
                'per_page' => $perPage,
            ],
        ]);
    }
}
