<?php

namespace App\Controllers\Public;

use App\Controllers\BaseController;
use App\Models\CertificatesModel;
use CodeIgniter\HTTP\ResponseInterface;

class Certificates extends BaseController
{
    /**
     * GET /api/public/certificates
     */
    public function index(): ResponseInterface
    {
        $model = new CertificatesModel();
        $result = $model->paginated(1, 100, true); // Return all active
        return $this->response->setJSON(['data' => $result['data']]);
    }
}
