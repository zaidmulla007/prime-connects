<?php
/**
 * Consolidate core panel sub-categories into ONE product per sub-category.
 * Each sub-category currently has N separate products (one per image).
 * This merges them into a single product with all images attached.
 * Run: php consolidate_core_panels.php
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

// Core panel sub-categories: id => desired product name & slug
$corePanelCategories = [
    20 => ['name' => 'MDF Core Panel',              'slug' => 'mdf-core-panel',              'sku' => 'MDF-CORE-PANEL'],
    21 => ['name' => 'MR MDF Core Panel',            'slug' => 'mr-mdf-core-panel',           'sku' => 'MRMDF-CORE-PANEL'],
    22 => ['name' => 'Marine & Construction Plywood', 'slug' => 'marine-construction-plywood', 'sku' => 'MARINE-PLY'],
    25 => ['name' => 'Melamine Faced MDF Panels',     'slug' => 'melamine-faced-mdf-panels',   'sku' => 'MEL-MDF-PANEL'],
    27 => ['name' => 'Melamine Faced Plywood',        'slug' => 'melamine-faced-plywood',      'sku' => 'MEL-PLYWOOD'],
    28 => ['name' => 'Solid Chip Board',              'slug' => 'solid-chip-board',            'sku' => 'SOLID-CHIP'],
];

$getProducts   = $pdo->prepare('SELECT id FROM products WHERE category_id = ? AND deleted_at IS NULL ORDER BY id ASC');
$getImages     = $pdo->prepare('SELECT id, url, alt FROM product_images WHERE product_id = ? ORDER BY sort_order ASC');
$insertProduct = $pdo->prepare('INSERT INTO products (name, slug, sku, category_id, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, 1, NOW(), NOW())');
$insertImage   = $pdo->prepare('INSERT INTO product_images (product_id, url, alt, sort_order, created_at) VALUES (?, ?, ?, ?, NOW())');
$deleteProduct = $pdo->prepare('DELETE FROM products WHERE id = ?');
$deleteImages  = $pdo->prepare('DELETE FROM product_images WHERE product_id = ?');
$checkSlug     = $pdo->prepare('SELECT id FROM products WHERE slug = ?');

foreach ($corePanelCategories as $catId => $info) {
    echo "\n[cat=$catId] {$info['name']}\n";

    // Get all current products in this category
    $getProducts->execute([$catId]);
    $productIds = $getProducts->fetchAll(PDO::FETCH_COLUMN);

    if (empty($productIds)) {
        echo "  SKIP: no products found\n";
        continue;
    }

    // Collect ALL images from all products
    $allImages = [];
    foreach ($productIds as $pid) {
        $getImages->execute([$pid]);
        $imgs = $getImages->fetchAll(PDO::FETCH_ASSOC);
        foreach ($imgs as $img) {
            $allImages[] = ['url' => $img['url'], 'alt' => $img['alt']];
        }
    }

    echo "  Found " . count($productIds) . " products, " . count($allImages) . " images total\n";

    // Delete old products and their images
    foreach ($productIds as $pid) {
        $deleteImages->execute([$pid]);
        $deleteProduct->execute([$pid]);
    }

    // Ensure unique slug
    $slug = $info['slug'];
    $base = $slug;
    $i = 1;
    while (true) {
        $checkSlug->execute([$slug]);
        if (!$checkSlug->fetch()) break;
        $slug = $base . '-' . $i++;
    }

    // Create single consolidated product
    $insertProduct->execute([$info['name'], $slug, $info['sku'], $catId]);
    $newProductId = (int) $pdo->lastInsertId();

    // Attach all images with sequential sort_order
    foreach ($allImages as $order => $img) {
        $insertImage->execute([$newProductId, $img['url'], $img['alt'], $order + 1]);
    }

    echo "  OK: Created product id=$newProductId slug=$slug with " . count($allImages) . " images\n";
}

echo "\n=== Done. Core panels consolidated. ===\n";

// Verify
echo "\nVerification:\n";
$rows = $pdo->query(
    'SELECT c.name as cat_name, p.id, p.name, p.slug, COUNT(pi.id) as img_count
     FROM categories c
     JOIN products p ON p.category_id = c.id AND p.deleted_at IS NULL
     LEFT JOIN product_images pi ON pi.product_id = p.id
     WHERE c.parent_id = 6
     GROUP BY p.id ORDER BY c.id, p.id'
)->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows as $r) {
    echo "  [{$r['cat_name']}] {$r['name']} → {$r['img_count']} images (slug={$r['slug']})\n";
}
