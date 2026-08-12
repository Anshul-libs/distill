// js/history.js

const HISTORY_KEY = "distill_history";

// Get history from localStorage
function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

// Add a new search
function addHistory(query) {
  if (!query || !query.trim()) return;

  const history = getHistory();

  history.unshift({
    query: query.trim(),
    time: Date.now(),
  });

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(history.slice(0, 50))
  );
}

// Clear all history
function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

// Format relative time
function relativeTime(ts) {
  const diff = Math.max(0, Date.now() - ts);

  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;

  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;

  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return new Date(ts).toLocaleDateString();
}

// Render history list
function draw() {
  const list = document.getElementById("history-list");
  if (!list) return;

  const items = getHistory();

  if (items.length === 0) {
    list.innerHTML = `
      <div class="px-5 py-8 text-center text-sm text-muted">
        No search history yet.
      </div>
    `;
    return;
  }

  list.innerHTML = items
    .map(
      (h) => `
        <a href="home.html?q=${encodeURIComponent(
          h.query
        )}" class="nav-link flex items-center gap-3 px-5 py-4 hover:bg-green-light/50">
          <span class="w-8 h-8 rounded-lg bg-cream flex items-center justify-center shrink-0">
            <i data-lucide="clock" class="w-4 h-4 text-gray-400"></i>
          </span>

          <span class="flex-1 text-sm text-ink">
            ${h.query}
          </span>

          <span class="text-xs text-muted shrink-0">
            ${relativeTime(h.time)}
          </span>
        </a>
      `
    )
    .join("");

  // Re-render Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Draw history when page loads
document.addEventListener("DOMContentLoaded", draw);