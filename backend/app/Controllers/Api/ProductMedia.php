<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\ProductImagesModel;
use App\Models\ProductsModel;
use CodeIgniter\HTTP\ResponseInterface;

class ProductMedia extends BaseController
{
    public function index(int $productId): ResponseInterface
    {
        $product = (new ProductsModel())->find($productId);
        if (!$product) return $this->response->setStatusCode(404)->setJSON(['error' => 'Product not found.']);

        $images = (new ProductImagesModel())->forProduct($productId);
        return $this->response->setJSON(['data' => $images]);
    }

    public function uploadBatch(int $productId): ResponseInterface
    {
        helper('file');

        $product = (new ProductsModel())->find($productId);
        if (!$product) return $this->response->setStatusCode(404)->setJSON(['error' => 'Product not found.']);

        $files = $_FILES['images'] ?? null;
        if (!$files) return $this->response->setStatusCode(422)->setJSON(['error' => 'No images uploaded.']);

        $model   = new ProductImagesModel();
        $saved   = [];
        $errors  = [];

        // Handle multiple files (restructure $_FILES array)
        $count = is_array($files['name']) ? count($files['name']) : 1;

        for ($i = 0; $i < $count; $i++) {
            if (is_array($files['name'])) {
                $file = [
                    'name'     => $files['name'][$i],
                    'type'     => $files['type'][$i],
                    'tmp_name' => $files['tmp_name'][$i],
                    'error'    => $files['error'][$i],
                    'size'     => $files['size'][$i],
                ];
            } else {
                $file = $files;
            }

            $result = upload_file($file, 'products');
            if (isset($result['error'])) {
                $errors[] = $result['error'];
                continue;
            }

            $maxOrder = $model->where('product_id', $productId)->selectMax('sort_order')->first();
            $sortOrder = ($maxOrder['sort_order'] ?? 0) + 1;

            $imgId = $model->insert([
                'product_id' => $productId,
                'url'        => $result['path'],
                'alt'        => $product['name'],
                'sort_order' => $sortOrder,
                'created_at' => date('Y-m-d H:i:s'),
            ]);

            $saved[] = $model->find($imgId);
        }

        if (empty($saved)) {
            return $this->response->setStatusCode(422)->setJSON(['error' => implode(', ', $errors)]);
        }

        return $this->response->setStatusCode(201)->setJSON(['data' => $saved, 'errors' => $errors]);
    }

    public function delete(int $productId, int $imageId): ResponseInterface
    {
        helper('file');

        $model = new ProductImagesModel();
        $image = $model->find($imageId);

        if (!$image || $image['product_id'] !== $productId) {
            return $this->response->setStatusCode(404)->setJSON(['error' => 'Image not found.']);
        }

        remove_file($image['url'], 'products');
        $model->delete($imageId);

        return $this->response->setJSON(['id' => $imageId, 'message' => 'Image deleted.']);
    }
}
