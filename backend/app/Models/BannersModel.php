<?php

namespace App\Models;

class BannersModel extends BaseAppModel
{
    protected $table         = 'banners';
    protected $primaryKey    = 'id';
    protected $allowedFields = [
        'image_url', 'title', 'subtitle', 'link_url',
        'is_permanent', 'from_date', 'to_date', 'is_active', 'sort_order',
        'created_at', 'updated_at'
    ];

    /**
     * Return currently active banners (is_active=1 and within date range if not permanent).
     */
    public function active(): array
    {
        $now = date('Y-m-d H:i:s');

        $this->where('is_active', 1)
             ->groupStart()
                ->where('is_permanent', 1)
                ->orGroupStart()
                    ->where('from_date <=', $now)
                    ->where('to_date >=', $now)
                ->groupEnd()
             ->groupEnd()
             ->orderBy('sort_order', 'ASC');

        return $this->findAll();
    }

    public function paginated(int $page = 1, int $perPage = 20): array
    {
        $total = $this->countAllResults(false);
        $data  = $this->orderBy('sort_order', 'ASC')->findAll($perPage, ($page - 1) * $perPage);
        return ['data' => $data, 'total' => $total];
    }
}
