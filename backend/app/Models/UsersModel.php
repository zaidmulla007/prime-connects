<?php

namespace App\Models;

class UsersModel extends BaseAppModel
{
    protected $table      = 'users';
    protected $primaryKey = 'id';
    protected $allowedFields = ['name', 'email', 'password_hash', 'role', 'created_at', 'updated_at'];

    public function findByEmail(string $email): ?array
    {
        return $this->where('email', $email)->first();
    }

    public function createAdmin(array $data): int|false
    {
        $now = date('Y-m-d H:i:s');
        return $this->insert([
            'name'          => $data['name'],
            'email'         => $data['email'],
            'password_hash' => password_hash($data['password'], PASSWORD_BCRYPT),
            'role'          => $data['role'] ?? 'editor',
            'created_at'    => $now,
            'updated_at'    => $now,
        ]);
    }

    public function paginated(int $page = 1, int $perPage = 20, ?string $q = null): array
    {
        $this->applyLike(['name', 'email'], $q);
        $total = $this->countAllResults(false);
        $data  = $this->orderBy('id', 'ASC')
                      ->findAll($perPage, ($page - 1) * $perPage);
        return ['data' => $data, 'total' => $total];
    }
}
