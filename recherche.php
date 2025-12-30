<?php
require 'config.php';

$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$results = [];

if ($search !== '') {
    // Recherche "contient" (LIKE %...%)
    $stmt = $pdo->prepare("
        SELECT id, name, type1, type2
        FROM pokemon
        WHERE name LIKE ?
        ORDER BY name ASC
    ");
    $stmt->execute(['%' . $search . '%']);
    $results = $stmt->fetchAll();
}
?>
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Résultats</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<?php require 'header.php'; ?>

<main class="container">
    <h1>Résultats</h1>

    <?php if ($search === ''): ?>
        <p>Entre un mot dans la barre de recherche.</p>

    <?php elseif (count($results) === 0): ?>
        <p>Aucun résultat pour : <strong><?= htmlspecialchars($search) ?></strong></p>

    <?php else: ?>
        <p><?= count($results) ?> résultat(s) pour : <strong><?= htmlspecialchars($search) ?></strong></p>

        <ul class="results">
            <?php foreach ($results as $row): ?>
                <li class="result-item">
                    <a href="element.php?id=<?= (int)$row['id'] ?>">
                        <?= htmlspecialchars($row['name']) ?>
                    </a>

                    <span class="types">
                        <?= htmlspecialchars($row['type1']) ?>
                        <?php if (!empty($row['type2'])): ?>
                            / <?= htmlspecialchars($row['type2']) ?>
                        <?php endif; ?>
                    </span>
                </li>
            <?php endforeach; ?>
        </ul>
    <?php endif; ?>

</main>

<script src="assets/js/app.js"></script>
</body>
</html>
