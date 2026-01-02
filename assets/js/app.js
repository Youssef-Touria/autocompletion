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

  // Fonction pour obtenir la classe CSS du type
  function getTypeClass(type) {
    const typeMap = {
      'Électrik': 'type-electrik',
      'Plante': 'type-plante',
      'Poison': 'type-poison',
      'Feu': 'type-feu',
      'Eau': 'type-eau',
      'Vol': 'type-vol'
    };
    return typeMap[type] || 'type-default';
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
          <a href="element.php?id=${item.id}" class="suggest-link">
            <img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.name)}" class="suggest-img">
            <div class="suggest-info">
              <div class="suggest-name">${escapeHtml(item.name)}</div>
              <div class="suggest-types">
                <span class="type-badge ${getTypeClass(item.type1)}">${escapeHtml(item.type1)}</span>
                ${item.type2 ? `<span class="type-badge ${getTypeClass(item.type2)}">${escapeHtml(item.type2)}</span>` : ''}
              </div>
            </div>
          </a>
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
          <a href="element.php?id=${item.id}" class="suggest-link">
            <img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.name)}" class="suggest-img">
            <div class="suggest-info">
              <div class="suggest-name">${escapeHtml(item.name)}</div>
              <div class="suggest-types">
                <span class="type-badge ${getTypeClass(item.type1)}">${escapeHtml(item.type1)}</span>
                ${item.type2 ? `<span class="type-badge ${getTypeClass(item.type2)}">${escapeHtml(item.type2)}</span>` : ''}
              </div>
            </div>
          </a>
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
    timer = setTimeout(async () => {
      try {
        const data = await fetchSuggestions(q);
        render(data);
      } catch (e) {
        hide();
      }
    }, 150);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-form")) {
      hide();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hide();
  });

  hide();
}