<?php
require 'config.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    http_response_code(400);
    die('ID invalide');
}

$stmt = $pdo->prepare("SELECT * FROM pokemon WHERE id = ?");
$stmt->execute([$id]);
$item = $stmt->fetch();

if (!$item) {
    http_response_code(404);
    die('Élément introuvable');
}
?>
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title><?= htmlspecialchars($item['name']) ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<?php require 'header.php'; ?>

<main class="container">
    <h1><?= htmlspecialchars($item['name']) ?></h1>

    <p>
        <strong>Type :</strong>
        <?= htmlspecialchars($item['type1']) ?>
        <?php if (!empty($item['type2'])): ?>
            / <?= htmlspecialchars($item['type2']) ?>
        <?php endif; ?>
    </p>

    <?php if (!empty($item['description'])): ?>
        <p><?= nl2br(htmlspecialchars($item['description'])) ?></p>
    <?php endif; ?>

    <?php if (!empty($item['image_url'])): ?>
        <img class="detail-img" src="<?= htmlspecialchars($item['image_url']) ?>" alt="<?= htmlspecialchars($item['name']) ?>">
    <?php endif; ?>

    <p>
        <a href="recherche.php?search=<?= urlencode($item['name']) ?>">Rechercher ce nom</a>
        ·
        <a href="index.php">Retour accueil</a>
    </p>
</main>

<script src="assets/js/app.js"></script>
</body>
</html>
