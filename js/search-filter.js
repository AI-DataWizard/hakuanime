// search-filter.js — Client-side search & filter

(function () {
  let activeFilter = 'All';
  let searchQuery = '';

  function filterAnime(anime, query, genre) {
    const q = query.toLowerCase().trim();
    const matchesSearch = !q ||
      anime.title.toLowerCase().includes(q) ||
      (anime.japanese && anime.japanese.toLowerCase().includes(q)) ||
      anime.genre.some(g => g.toLowerCase().includes(q)) ||
      (anime.tags && anime.tags.some(t => t.toLowerCase().includes(q)));
    const matchesGenre = genre === 'All' || anime.genre.includes(genre);
    return matchesSearch && matchesGenre;
  }

  function applyFilters() {
    if (!window.allAnime) return;
    const filtered = window.allAnime.filter(a => filterAnime(a, searchQuery, activeFilter));

    // Show search results section if querying
    const searchSection = document.getElementById('search-results-section');
    const mainSections = document.getElementById('main-sections');
    const resultsGrid = document.getElementById('search-results-grid');
    const resultsTitle = document.getElementById('search-results-title');

    if (!searchSection || !resultsGrid) return;

    const isFiltering = searchQuery.trim() !== '' || activeFilter !== 'All';

    if (isFiltering) {
      searchSection.classList.add('visible');
      if (mainSections) mainSections.style.display = 'none';
      if (resultsTitle) {
        resultsTitle.innerHTML = `Showing <span>${filtered.length} results</span>${searchQuery ? ` for "<span>${searchQuery}</span>"` : ''}${activeFilter !== 'All' ? ` in <span>${activeFilter}</span>` : ''}`;
      }
      resultsGrid.innerHTML = '';
      if (filtered.length === 0) {
        resultsGrid.innerHTML = '<div class="no-results">No anime found. Try a different search.</div>';
      } else {
        filtered.forEach(a => resultsGrid.appendChild(createAnimeCard(a)));
      }
    } else {
      searchSection.classList.remove('visible');
      if (mainSections) mainSections.style.display = '';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.genre || 'All';
        applyFilters();
      });
    });

    // Search input
    const searchInputs = document.querySelectorAll('.search-input-field, .header-search input');
    searchInputs.forEach(input => {
      input.addEventListener('input', e => {
        searchQuery = e.target.value;
        // Sync other inputs
        searchInputs.forEach(i => { if (i !== input) i.value = searchQuery; });
        applyFilters();
      });
    });
  });

  window.applyFilters = applyFilters;
})();
