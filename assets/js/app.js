const input = document.getElementById("searchInput");
const box = document.getElementById("suggestions");

if (input && box) {
  let timer = null;

  function hide() {
    box.innerHTML = "";
    box.style.display = "none";
  }

  function show() {
    box.style.display = "block";
  }

  // Sécurité simple pour éviter d'injecter du HTML
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m]));
  }

  async function fetchSuggestions(q) {
    const res = await fetch(`api_suggest.php?q=${encodeURIComponent(q)}`);
    if (!res.ok) return { starts: [], contains: [] };
    return res.json();
  }

  function render(data) {
    const starts = data.starts || [];
    const contains = data.contains || [];

    if (starts.length === 0 && contains.length === 0) {
      hide();
      return;
    }

    let html = `<ul class="suggest-list">`;

    // 1) commence par
    for (const item of starts) {
      html += `
        <li class="suggest-item">
          <a href="element.php?id=${item.id}">${escapeHtml(item.name)}</a>
        </li>
      `;
    }

    // séparateur si les deux parties existent
    if (starts.length > 0 && contains.length > 0) {
      html += `<li class="suggest-separator">Autres résultats</li>`;
    }

    // 2) contient
    for (const item of contains) {
      html += `
        <li class="suggest-item">
          <a href="element.php?id=${item.id}">${escapeHtml(item.name)}</a>
        </li>
      `;
    }

    html += `</ul>`;

    box.innerHTML = html;
    show();
  }

  input.addEventListener("input", () => {
    const q = input.value.trim();

    clearTimeout(timer);

    if (q.length === 0) {
      hide();
      return;
    }

    // petit debounce pour éviter trop de requêtes
    timer = setTimeout(async () => {
      try {
        const data = await fetchSuggestions(q);
        render(data);
      } catch (e) {
        hide();
      }
    }, 150);
  });

  // Cache la box si on clique dehors
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-form")) {
      hide();
    }
  });

  // Échap pour fermer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hide();
  });

  // Au chargement, on cache
  hide();
}
