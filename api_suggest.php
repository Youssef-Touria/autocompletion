<?php
require 'config.php';
header('Content-Type: application/json; charset=utf-8');
$q = isset($_GET['q']) ? trim($_GET['q']) : '';
$q = mb_substr($q, 0, 50);
if ($q === '') {
    echo json_encode(['starts' => [], 'contains' => []]);
    exit;
}
$limit = 6;
// 1) Commence par (q%)
$stmt = $pdo->prepare("
    SELECT id, name, type1, type2, image_url
    FROM pokemon
    WHERE name LIKE ?
    ORDER BY name ASC
    LIMIT $limit
");
$stmt->execute([$q . '%']);
$starts = $stmt->fetchAll();
// 2) Contient (%q%) mais ne commence pas par
$stmt2 = $pdo->prepare("
    SELECT id, name, type1, type2, image_url
    FROM pokemon
    WHERE name LIKE ?
      AND name NOT LIKE ?
    ORDER BY name ASC
    LIMIT $limit
");
$stmt2->execute(['%' . $q . '%', $q . '%']);
$contains = $stmt2->fetchAll();
echo json_encode([
    'starts' => $starts,
    'contains' => $contains
]);