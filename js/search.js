// js/search.js
function goToResults(query) {
  if (!query || !query.trim()) return;
  addHistory(query);
  window.location.href = `home.html?q=${encodeURIComponent(query.trim())}`;
}