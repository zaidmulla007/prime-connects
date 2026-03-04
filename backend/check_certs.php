<?php
$env = file_get_contents(__DIR__ . '/.env');
preg_match('/database\.default\.hostname\s*=\s*(.+)/', $env, $h);
preg_match('/database\.default\.database\s*=\s*(.+)/', $env, $d);
preg_match('/database\.default\.username\s*=\s*(.+)/', $env, $u);
preg_match('/database\.default\.password\s*=\s*(.*)/', $env, $p);
$pdo = new PDO('mysql:host='.trim($h[1]).';dbname='.trim($d[1]).';charset=utf8mb4', trim($u[1]), trim(trim($p[1]??''), "'\""));
$rows = $pdo->query('SELECT id, title, image_url, sort_order FROM certificates ORDER BY sort_order')->fetchAll(PDO::FETCH_ASSOC);
if (empty($rows)) echo "No certificates in DB yet.\n";
else foreach ($rows as $r) echo "[{$r['id']}] {$r['title']} | {$r['image_url']}\n";
