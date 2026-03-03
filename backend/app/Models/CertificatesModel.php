<?php

namespace App\Models;

class CertificatesModel extends BaseAppModel
{
    protected $table         = 'certificates';
    protected $primaryKey    = 'id';
    protected $allowedFields = [
        'title', 'description', 'image_url', 'sort_order', 'is_active',
        'created_at', 'updated_at'
    ];

    public function paginated(int $page = 1, int $perPage = 20, bool $activeOnly = false): array
    {
        if ($activeOnly) {
            $this->where('is_active', 1);
        }
        $total = $this->countAllResults(false);
        $data  = $this->orderBy('sort_order', 'ASC')->findAll($perPage, ($page - 1) * $perPage);
        return ['data' => $data, 'total' => $total];
    }
}
