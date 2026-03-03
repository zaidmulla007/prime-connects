<?php

namespace App\Models;

class InquiriesModel extends BaseAppModel
{
    protected $table         = 'inquiries';
    protected $primaryKey    = 'id';
    protected $allowedFields = [
        'name', 'email', 'phone', 'subject', 'message',
        'company', 'product_name', 'form_type', 'is_read', 'created_at'
    ];

    public function paginated(int $page = 1, int $perPage = 20, ?string $q = null, ?string $formType = null): array
    {
        if ($formType) {
            $this->where('form_type', $formType);
        }
        $this->applyLike(['name', 'email', 'subject'], $q);
        $total = $this->countAllResults(false);
        $data  = $this->orderBy('created_at', 'DESC')->findAll($perPage, ($page - 1) * $perPage);
        return ['data' => $data, 'total' => $total];
    }
}
