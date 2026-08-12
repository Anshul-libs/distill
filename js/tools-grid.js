// js/tools-grid.js
const PRICING_LABEL_G = { free: "Free", hybrid: "Hybrid", paid: "Paid" };
const PRICING_CLASS_G = {
  free: "bg-green-light text-green-dark",
  hybrid: "bg-amber-50 text-amber-600",
  paid: "bg-red-50 text-red-500",
};

// Not random: Distill Rating (avg) x total ratings, falling back to the
// tool's seed rating so freshly-loaded data still ranks sensibly.
function trendingScore(tool) {
  const avg = getAvgRating(tool.id);
  const count = getRatingCount(tool.id);
  const base = avg || tool.rating || 0;
  return base * (count + 1);
}

function toolGridCard(tool, badgeText) {
  const avg = getAvgRating(tool.id);
  const count = getRatingCount(tool.id);
  const ratingDisplay = avg ? `${avg.toFixed(1)} Distill Rating (${count})` : "No ratings yet";

  return `
    <a href="home.html?q=${encodeURIComponent(tool.name)}" class="rec-card block bg-white rounded-card border border-line p-6 relative">
      ${badgeText ? `<span class="absolute -top-2.5 left-5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-green text-white shadow-card">${badgeText}</span>` : ""}
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="font-bold text-lg leading-tight">${tool.name}</h3>
          <p class="text-xs text-muted mt-1">${tool.category}</p>
        </div>
        <span class="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${PRICING_CLASS_G[tool.pricing]}">${PRICING_LABEL_G[tool.pricing]}</span>
      </div>
      <p class="text-sm text-ink/80 mt-4 leading-relaxed">${tool.description}</p>
      <div class="mt-4 text-xs">
        <span class="font-semibold text-green">Credits:</span> ${tool.credits || "Not specified"}
      </div>
      <div class="mt-5 flex items-center justify-between">
        <span class="flex items-center gap-1 text-xs text-gray-400">
          <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
          ${ratingDisplay}
        </span>
        <span class="text-xs font-semibold text-green-dark">View match →</span>
      </div>
    </a>`;
}

function renderToolGrid(containerId, tools, badgeText) {
  const root = document.getElementById(containerId);
  if (!root) return;
  if (!tools.length) {
    root.innerHTML = `<p class="col-span-full text-center text-muted py-16">Nothing to show here yet.</p>`;
    return;
  }
  root.innerHTML = tools.map((t) => toolGridCard(t, badgeText)).join("");
  if (window.lucide) lucide.createIcons();
}
