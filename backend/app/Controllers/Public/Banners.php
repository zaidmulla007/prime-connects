<?php

namespace App\Controllers\Public;

use App\Controllers\BaseController;
use App\Models\BannersModel;
use CodeIgniter\HTTP\ResponseInterface;

class Banners extends BaseController
{
    /**
     * GET /api/public/banners/active
     */
    public function active(): ResponseInterface
    {
        $model   = new BannersModel();
        $banners = $model->active();
        return $this->response->setJSON(['data' => $banners]);
    }
}
