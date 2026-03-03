<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\ProductSpecsModel;
use App\Models\ProductsModel;
use CodeIgniter\HTTP\ResponseInterface;

class ProductSpecs extends BaseController
{
    private ProductSpecsModel $model;

    public function __construct()
    {
        $this->model = new ProductSpecsModel();
    }

    public function index(int $productId): ResponseInterface
    {
        $specs = $this->model->forProduct($productId);
        return $this->response->setJSON(['data' => $specs]);
    }

    public function create(int $productId): ResponseInterface
    {
        $product = (new ProductsModel())->find($productId);
        if (!$product) return $this->response->setStatusCode(404)->setJSON(['error' => 'Product not found.']);

        $data  = $this->request->getJSON(true) ?? [];
        $specs = $data['specs'] ?? [$data]; // Accept array or single

        $now   = date('Y-m-d H:i:s');
        $saved = [];
        foreach ($specs as $i => $spec) {
            $label = trim($spec['label'] ?? '');
            $value = trim($spec['value'] ?? '');
            if (!$label || !$value) continue;

            $maxOrder = $this->model->where('product_id', $productId)->selectMax('sort_order')->first();
            $id = $this->model->insert([
                'product_id' => $productId,
                'label'      => $label,
                'value'      => $value,
                'unit'       => $spec['unit'] ?? '',
                'sort_order' => ($maxOrder['sort_order'] ?? 0) + $i + 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
            $saved[] = $this->model->find($id);
        }

        return $this->response->setStatusCode(201)->setJSON(['data' => $saved]);
    }

    public function update(int $productId, int $specId): ResponseInterface
    {
        $spec = $this->model->find($specId);
        if (!$spec || $spec['product_id'] !== $productId) {
            return $this->response->setStatusCode(404)->setJSON(['error' => 'Spec not found.']);
        }

        $data = $this->request->getJSON(true) ?? [];
        $this->model->update($specId, array_filter([
            'label'      => $data['label'] ?? null,
            'value'      => $data['value'] ?? null,
            'unit'       => $data['unit'] ?? null,
            'sort_order' => $data['sort_order'] ?? null,
            'updated_at' => date('Y-m-d H:i:s'),
        ], fn($v) => $v !== null));

        return $this->response->setJSON(['data' => $this->model->find($specId)]);
    }

    public function delete(int $productId, int $specId): ResponseInterface
    {
        $spec = $this->model->find($specId);
        if (!$spec || $spec['product_id'] !== $productId) {
            return $this->response->setStatusCode(404)->setJSON(['error' => 'Spec not found.']);
        }
        $this->model->delete($specId);
        return $this->response->setJSON(['id' => $specId, 'message' => 'Spec deleted.']);
    }
}
