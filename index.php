<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Autocomplétion</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<?php require 'header.php'; ?>

<main class="home">
  <h1>Mon moteur de recherche</h1>
  <p>Commence à taper pour voir les suggestions.</p>

  <form class="search-form" autocomplete="off" onsubmit="return false;">
    <input
      id="searchInput"
      type="text"
      placeholder="Rechercher..."
      autocomplete="off"
    >
    <div id="suggestions"></div>
  </form>
</main>

<script src="assets/js/app.js" defer></script>

</body>
</html>
