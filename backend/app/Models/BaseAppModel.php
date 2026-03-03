<?php

namespace App\Models;

use CodeIgniter\Model;

abstract class BaseAppModel extends Model
{
    protected $returnType     = 'array';
    protected $useTimestamps  = false;
    protected $dateFormat     = 'datetime';

    /**
     * Apply a LIKE search across multiple columns.
     */
    protected function applyLike(array $columns, ?string $q): static
    {
        if ($q === null || $q === '') {
            return $this;
        }
        $this->groupStart();
        foreach ($columns as $i => $col) {
            if ($i === 0) {
                $this->like($col, $q);
            } else {
                $this->orLike($col, $q);
            }
        }
        $this->groupEnd();
        return $this;
    }

    /**
     * Generate a basic URL-safe slug from text.
     */
    protected function safeSlug(string $text): string
    {
        $text = strtolower(trim($text));
        $text = preg_replace('/[^a-z0-9]+/', '-', $text);
        return trim($text, '-');
    }
}
