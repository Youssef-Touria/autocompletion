<?php
// Récupère la recherche si elle existe dans l’URL
$search = isset($_GET['search']) ? htmlspecialchars($_GET['search']) : '';
?>

<header class="header">
    <div class="logo">
        <a href="index.php">Autocomplétion</a>
    </div>

    <form action="recherche.php" method="GET" class="search-form" autocomplete="off">
        <input
            type="text"
            name="search"
            id="searchInput"
            placeholder="Rechercher..."
            value="<?= $search ?>"
        >

        <!-- Zone d’autocomplétion -->
        <div id="suggestions" class="suggestions"></div>
    </form>
</header>
