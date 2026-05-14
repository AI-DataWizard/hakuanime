// watchlist.js — Manages user's watchlist via localStorage

const WATCHLIST_KEY = 'hakuanime-watchlist';

function getWatchlist() {
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY)) || [];
  } catch {
    return [];
  }
}

function saveWatchlist(list) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
}

function isInWatchlist(id) {
  return getWatchlist().includes(id);
}

function addToWatchlist(id) {
  const list = getWatchlist();
  if (!list.includes(id)) {
    list.push(id);
    saveWatchlist(list);
    return true;
  }
  return false;
}

function removeFromWatchlist(id) {
  const list = getWatchlist().filter(item => item !== id);
  saveWatchlist(list);
}

function toggleWatchlistItem(id, title) {
  if (isInWatchlist(id)) {
    removeFromWatchlist(id);
    showToast(`Removed from watchlist`, 'info');
    return false;
  } else {
    addToWatchlist(id);
    showToast(`Added to watchlist!`, 'success');
    return true;
  }
}

window.getWatchlist = getWatchlist;
window.isInWatchlist = isInWatchlist;
window.addToWatchlist = addToWatchlist;
window.removeFromWatchlist = removeFromWatchlist;
window.toggleWatchlistItem = toggleWatchlistItem;
