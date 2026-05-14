// anime-data.js — Handles loading and rendering anime data

let allAnime = [];

async function loadAnime() {
  try {
    const res = await fetch("../data/anime.json");
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
          <a href="/pages/anime-detail.html?id=${
            anime.id
          }" class="overlay-btn play">▶ Watch</a>
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
      window.location.href = `/pages/anime-detail.html?id=${anime.id}`;
    }
  });
  return card;
}

function createTrendingCard(anime, index) {
  const card = document.createElement("div");
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
  card.addEventListener(
    "click",
    () => (window.location.href = `/pages/anime-detail.html?id=${anime.id}`)
  );
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

/* 
// 2. Load all anime from the JSON
const anime = await loadAnime();



// a is now the Death Note object { title: "Death Note", rating: 8.6, ... }

// 4. Fill the page with its data
document.title = `${a.title} — HakuAnime`;
document.getElementById("detail-poster").src = a.cover;
document.getElementById("detail-info").innerHTML = `
  <h1>${a.title}</h1>
  <p>${a.description}</p>
  ...
`;
*/
