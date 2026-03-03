<?php

namespace App\Models;

class ProductImagesModel extends BaseAppModel
{
    protected $table         = 'product_images';
    protected $primaryKey    = 'id';
    protected $allowedFields = ['product_id', 'url', 'alt', 'sort_order', 'created_at'];

    public function forProduct(int $productId): array
    {
        return $this->where('product_id', $productId)->orderBy('sort_order', 'ASC')->findAll();
    }
}
