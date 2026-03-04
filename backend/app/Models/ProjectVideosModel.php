<?php

namespace App\Models;

class ProjectVideosModel extends BaseAppModel
{
    protected $table         = 'project_videos';
    protected $primaryKey    = 'id';
    protected $allowedFields = [
        'title', 'video_url', 'thumbnail_url',
        'sort_order', 'is_active',
        'created_at', 'updated_at',
    ];

    public function paginated(int $page = 1, int $perPage = 12, ?string $q = null, bool $activeOnly = false): array
    {
        if ($activeOnly) {
            $this->where('is_active', 1);
        }
        $this->applyLike(['title'], $q);
        $total = $this->countAllResults(false);
        $data  = $this->orderBy('sort_order', 'ASC')->orderBy('id', 'ASC')
                      ->findAll($perPage, ($page - 1) * $perPage);
        return ['data' => $data, 'total' => $total];
    }
}
