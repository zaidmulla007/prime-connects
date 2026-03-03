<?php

namespace App\Models;

class ProjectsModel extends BaseAppModel
{
    protected $table         = 'projects';
    protected $primaryKey    = 'id';
    protected $allowedFields = [
        'title', 'slug', 'description', 'image_url',
        'location', 'year', 'sort_order', 'is_active',
        'created_at', 'updated_at'
    ];

    public function findBySlug(string $slug): ?array
    {
        return $this->where('slug', $slug)->first();
    }

    public function ensureUniqueSlug(string $name): string
    {
        helper('slugify');
        return generate_unique_slug($name, $this->table);
    }

    public function paginated(int $page = 1, int $perPage = 12, ?string $q = null, bool $activeOnly = false): array
    {
        if ($activeOnly) {
            $this->where('is_active', 1);
        }
        $this->applyLike(['title', 'location', 'description'], $q);
        $total = $this->countAllResults(false);
        $data  = $this->orderBy('sort_order', 'ASC')->orderBy('id', 'DESC')
                      ->findAll($perPage, ($page - 1) * $perPage);
        return ['data' => $data, 'total' => $total];
    }
}
