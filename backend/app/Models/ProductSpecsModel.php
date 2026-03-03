<?php

namespace App\Models;

class ProductSpecsModel extends BaseAppModel
{
    protected $table         = 'product_specs';
    protected $primaryKey    = 'id';
    protected $allowedFields = ['product_id', 'label', 'value', 'unit', 'sort_order', 'created_at', 'updated_at'];

    public function forProduct(int $productId): array
    {
        return $this->where('product_id', $productId)->orderBy('sort_order', 'ASC')->findAll();
    }
}
