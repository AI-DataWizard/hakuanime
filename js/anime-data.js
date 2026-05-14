// anime-data.js — Handles loading and rendering anime data

let allAnime = [];

// ── Helper: project root path ────────────────────────────────────────────────
// window.location.pathname on GitHub Pages looks like:
//   /hakuanime/              ← index.html (root)
//   /hakuanime/pages/about.html  ← a pages/ file
//
// We strip the filename and walk up until we reach the project root.
// The root is identified by NOT containing '/pages/' in the path.
//
// Returns a string like '/hakuanime/' (always ends with /).
function getBasePath() {
  const path = window.location.pathname; // e.g. /hakuanime/pages/about.html

  // Remove the filename (everything after the last /) to get the directory
  const dir = path.substring(0, path.lastIndexOf("/") + 1);
  // e.g. /hakuanime/pages/

  // If we are inside /pages/, go up one level to reach the project root
  if (dir.includes("/pages/")) {
    return dir.substring(0, dir.indexOf("/pages/") + 1);
    // /hakuanime/pages/ → /hakuanime/
  }

  // Otherwise we are already at the root level (index.html)
  return dir;
  // /hakuanime/
}

// ── Helper: URL to anime-detail.html for a given anime id ───────────────────
// Always builds an absolute path from the project root so it works from both
// index.html (root level) and pages/*.html (one level deep).
function getDetailUrl(id) {
  return `${getBasePath()}pages/anime-detail.html?id=${id}`;
  // e.g. /hakuanime/pages/anime-detail.html?id=death-note
}

// ── loadAnime ────────────────────────────────────────────────────────────────
// fetch() requires an absolute path on GitHub Pages.
// getBasePath() gives us /hakuanime/ so the full URL becomes:
//   /hakuanime/data/anime.json  ✓   (GitHub Pages)
//   /data/anime.json            ✓   (local dev if served from root)
async function loadAnime() {
  try {
    alert(`${getBasePath()}data/anime.json`);
    const res = await fetch(`${getBasePath()}data/anime.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allAnime = await res.json();
    return allAnime;
  } catch (e) {
    console.error("Failed to load anime data:", e);
    return [];
  }
}

function createAnimeCard(anime) {
  const watchlist = getWatchlist();
  const inWatchlist = watchlist.includes(anime.id);
  const detailUrl = getDetailUrl(anime.id);
  const card = document.createElement("div");
  card.className = "anime-card";
  card.dataset.id = anime.id;
  card.innerHTML = `
    <div class="card-poster">
      <img src="${anime.cover}" alt="${
    anime.title
  }" loading="lazy" onerror="this.src='https://via.placeholder.com/200x300/16161a/e62429?text=No+Image'">
      ${anime.trending ? '<span class="card-badge">HOT</span>' : ""}
      <div class="card-rating">⭐ ${anime.rating}</div>
        <div class="card-overlay">
        <div class="overlay-actions">
          <a href="${detailUrl}" class="overlay-btn play">▶ Watch</a>
          <button class="overlay-btn add ${
            inWatchlist ? "in-watchlist" : ""
          }" onclick="toggleWatchlistCard(event, '${anime.id}')">
            ${inWatchlist ? "✓ Saved" : "+ List"}
          </button>
        </div>
      </div>
    </div>
    <div class="card-info">
      <div class="card-title">${anime.title}</div>
      <div class="card-meta">
        <span>${anime.year}</span>
        <span class="card-meta-dot"></span>
        <span>${anime.episodes} EP</span>
      </div>
    </div>
  `;
  card.addEventListener("click", (e) => {
    if (!e.target.closest(".overlay-btn")) {
      window.location.href = detailUrl;
    }
  });
  return card;
}

function createTrendingCard(anime, index) {
  const card = document.createElement("div");
  const detailUrl = getDetailUrl(anime.id);
  card.className = "trending-card";
  card.innerHTML = `
    <div class="trending-thumb">
      <img src="${anime.cover}" alt="${
    anime.title
  }" loading="lazy" onerror="this.src='https://via.placeholder.com/70x100/16161a/e62429?text=?'">
    </div>
    <div class="trending-info">
      <div class="trending-num">${String(index + 1).padStart(2, "0")}</div>
      <div class="trending-title">${anime.title}</div>
      <div class="trending-genres">
        ${anime.genre
          .slice(0, 2)
          .map((g) => `<span class="trending-genre-tag">${g}</span>`)
          .join("")}
      </div>
      <div class="trending-status ${anime.status.toLowerCase()}">${
    anime.status === "Ongoing" ? "● Ongoing" : "✓ Completed"
  }</div>
    </div>
  `;
  card.addEventListener("click", () => (window.location.href = detailUrl));
  return card;
}

function toggleWatchlistCard(e, id) {
  e.stopPropagation();
  const btn = e.currentTarget;
  const wasAdded = toggleWatchlistItem(
    id,
    btn.closest(".anime-card")?.querySelector(".card-title")?.textContent || id
  );
  btn.classList.toggle("in-watchlist", wasAdded);
  btn.textContent = wasAdded ? "✓ Saved" : "+ List";
}

window.toggleWatchlistCard = toggleWatchlistCard;
window.getBasePath = getBasePath;
window.getDetailUrl = getDetailUrl;

function createAnimeDetailPage(anime) {
  // 1. Read the URL: "anime-detail.html?id=death-note"
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id"); // id = "death-note"

  // 3. Find the one matching anime object
  const a = anime.find((x) => x.id === id);

  document.title = `${a.title} — HakuAnime`;
  document.getElementById("detail-poster").src = a.cover;
  document.getElementById("detail-info").innerHTML = `
    <h1>${a.title}</h1>
    <p>${a.description}</p>
    <ul>
      <li><strong>Rating:</strong> ${a.rating}</li>
      <li><strong>Year:</strong> ${a.year}</li>
      <li><strong>Episodes:</strong> ${a.episodes}</li>
      <li><strong>Status:</strong> ${a.status}</li>
      <li><strong>Genres:</strong> ${a.genre.join(", ")}</li>
    </ul>
  `;
}

window.createAnimeDetailPage = createAnimeDetailPage;
