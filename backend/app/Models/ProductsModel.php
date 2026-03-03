<?php

namespace App\Models;

class ProductsModel extends BaseAppModel
{
    protected $table          = 'products';
    protected $primaryKey     = 'id';
    protected $useSoftDeletes = true;
    protected $deletedField   = 'deleted_at';
    protected $allowedFields  = [
        'name', 'slug', 'sku', 'description', 'meta', 'category_id',
        'is_active', 'created_at', 'updated_at', 'deleted_at'
    ];

    public function findBySlug(string $slug): ?array
    {
        return $this->where('slug', $slug)->first();
    }

    public function ensureUniqueSlug(string $name, ?int $excludeId = null): string
    {
        helper('slugify');
        $base  = generate_unique_slug($name, $this->table);
        if ($excludeId) {
            $existing = $this->where('slug', $base)->where('id !=', $excludeId)->first();
            if (!$existing) return $base;
        }
        return $base;
    }

    /**
     * Paginated list with category name join.
     */
    public function paginated(int $page = 1, int $perPage = 12, ?string $q = null, ?int $categoryId = null): array
    {
        $this->select('products.*, categories.name as category_name')
             ->join('categories', 'categories.id = products.category_id', 'left');

        if ($categoryId) {
            $this->where('products.category_id', $categoryId);
        }

        $this->applyLike(['products.name', 'products.sku'], $q);

        $total = $this->countAllResults(false);
        $data  = $this->orderBy('products.created_at', 'DESC')
                      ->findAll($perPage, ($page - 1) * $perPage);

        return ['data' => $data, 'total' => $total];
    }

    /**
     * Full product with images and specs for public display.
     */
    public function withImagesAndSpecs(array $product): array
    {
        $db = \Config\Database::connect();

        $images = $db->table('product_images')
            ->where('product_id', $product['id'])
            ->orderBy('sort_order', 'ASC')
            ->get()->getResultArray();

        $specs = $db->table('product_specs')
            ->where('product_id', $product['id'])
            ->orderBy('sort_order', 'ASC')
            ->get()->getResultArray();

        $category = null;
        if ($product['category_id']) {
            $category = $db->table('categories')
                ->where('id', $product['category_id'])
                ->get()->getRowArray();
        }

        $product['images']   = $images;
        $product['specs']    = $specs;
        $product['category'] = $category;

        return $product;
    }
}
