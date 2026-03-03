<?php

namespace App\Models;

class CategoriesModel extends BaseAppModel
{
    protected $table         = 'categories';
    protected $primaryKey    = 'id';
    protected $allowedFields = [
        'name', 'slug', 'image_url', 'description',
        'parent_id', 'type', 'sort_order', 'path', 'depth', 'meta',
        'created_at', 'updated_at'
    ];

    public function findBySlug(string $slug): ?array
    {
        return $this->where('slug', $slug)->first();
    }

    /**
     * Return all categories as nested tree.
     */
    public function getTree(): array
    {
        $all = $this->orderBy('sort_order', 'ASC')->orderBy('id', 'ASC')->findAll();
        return $this->buildTree($all);
    }

    /**
     * Return flat list (all categories).
     */
    public function getFlat(): array
    {
        return $this->orderBy('depth', 'ASC')->orderBy('sort_order', 'ASC')->findAll();
    }

    /**
     * Return immediate children of a parent.
     */
    public function childrenOf(?int $parentId): array
    {
        return $this->where('parent_id', $parentId)->orderBy('sort_order', 'ASC')->findAll();
    }

    /**
     * Rebuild path and depth for a category and all its descendants (BFS).
     */
    public function updatePathDepth(int $id, ?int $parentId, string $parentPath = '', int $parentDepth = 0): void
    {
        $db = \Config\Database::connect();

        $depth = $parentDepth;
        $path  = $parentPath ? $parentPath . '/' . $id : (string)$id;

        $db->table($this->table)->where('id', $id)->update([
            'path'  => $path,
            'depth' => $depth,
        ]);

        // Recurse for children
        $children = $this->childrenOf($id);
        foreach ($children as $child) {
            $this->updatePathDepth($child['id'], $id, $path, $depth + 1);
        }
    }

    /**
     * Build a nested tree from a flat array.
     */
    private function buildTree(array $items, ?int $parentId = null): array
    {
        $tree = [];
        foreach ($items as $item) {
            $itemParent = $item['parent_id'] ? (int)$item['parent_id'] : null;
            if ($itemParent === $parentId) {
                $item['children'] = $this->buildTree($items, (int)$item['id']);
                $tree[] = $item;
            }
        }
        return $tree;
    }
}
