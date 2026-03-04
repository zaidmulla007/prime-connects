<?php
/**
 * Fix category structure to match correct hierarchy.
 * Run: php fix_categories.php
 */

$env = file_get_contents(__DIR__ . '/.env');
preg_match('/database\.default\.hostname\s*=\s*(.+)/', $env, $h);
preg_match('/database\.default\.database\s*=\s*(.+)/', $env, $d);
preg_match('/database\.default\.username\s*=\s*(.+)/', $env, $u);
preg_match('/database\.default\.password\s*=\s*(.*)/', $env, $p);
$pdo = new PDO(
    'mysql:host=' . trim($h[1]) . ';dbname=' . trim($d[1]) . ';charset=utf8mb4',
    trim($u[1]),
    trim(trim($p[1] ?? ''), "'\""),
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

/**
 * Each entry: [from_category_id, to_category_id, label]
 * Products in `from` are reassigned to `to`, then `from` category is deleted.
 */
$moves = [
    // Bar Cabinets (18) → Kitchen Cabinet (17)
    [18, 17, 'Bar Cabinets → Kitchen Cabinet'],

    // Wardrobes & Closets (19) → Wardrobes (5)
    [19, 5, 'Wardrobes & Closets → Wardrobes'],

    // Core Panel Plywood (23) → Core Panels (6)
    [23, 6, 'Core Panel Plywood → Core Panels'],

    // Film Faced MDF Panels (24) → Melamine Faced MDF Panels (25)
    [24, 25, 'Film Faced MDF Panels → Melamine Faced MDF Panels'],

    // Film Faced Plywood (26) → Melamine Faced Plywood (27)
    [26, 27, 'Film Faced Plywood → Melamine Faced Plywood'],
];

$moveProducts = $pdo->prepare('UPDATE products SET category_id = ? WHERE category_id = ?');
$deleteCategory = $pdo->prepare('DELETE FROM categories WHERE id = ?');
$countProducts = $pdo->prepare('SELECT COUNT(*) FROM products WHERE category_id = ?');

foreach ($moves as [$fromId, $toId, $label]) {
    $countProducts->execute([$fromId]);
    $count = (int) $countProducts->fetchColumn();

    $moveProducts->execute([$toId, $fromId]);
    $deleteCategory->execute([$fromId]);

    echo "OK: $label | moved $count products\n";
}

echo "\nDone. Verifying remaining categories:\n";
$rows = $pdo->query('SELECT id, name, slug, parent_id, depth FROM categories ORDER BY depth, parent_id, sort_order')->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows as $r) {
    echo str_repeat('  ', $r['depth']) . '[' . $r['id'] . '] ' . $r['name'] . ' (slug=' . $r['slug'] . ")\n";
}
