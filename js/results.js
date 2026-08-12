const PRICING_LABEL = { free: "Free", hybrid: "Hybrid", paid: "Paid" };
const PRICING_CLASS = {
  free: "bg-green-light text-green-dark",
  hybrid: "bg-yellow-50 text-hybrid",
  paid: "bg-red-50 text-paid",
};

function fillCard(node, tool, isBest) {
  node.querySelector(".tool-name").textContent = tool.name;
  node.querySelector(".tool-category").textContent = tool.category;
  node.querySelector(".tool-description").textContent = tool.description;
  node.querySelector(".tool-rating").textContent = tool.rating.toFixed(1);
  node.querySelector(".tool-link").href = tool.url;

  const badge = node.querySelector(".pricing-badge");
  badge.textContent = PRICING_LABEL[tool.pricing];
  badge.className = `pricing-badge shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${PRICING_CLASS[tool.pricing]}`;

  const prosList = node.querySelector(".tool-pros");
  prosList.innerHTML = tool.pros
    .slice(0, isBest ? 3 : 2)
    .map((p) => `<li class="flex gap-1"><span>·</span><span>${p}</span></li>`)
    .join("");
  const consList = node.querySelector(".tool-cons");
  consList.innerHTML = tool.cons
    .slice(0, isBest ? 3 : 2)
    .map((c) => `<li class="flex gap-1"><span>·</span><span>${c}</span></li>`)
    .join("");
}

function renderResults(tools, query) {
  const [best, ...alts] = tools;
  document.getElementById("queryLabel").textContent = `"${query}"`;

  const bestSlot = document.getElementById("bestCardSlot");
  bestSlot.innerHTML = "";
  const bestNode = document.getElementById("recCardTemplate").content.cloneNode(true);
  const bestCardEl = bestNode.querySelector(".rec-card");
  bestCardEl.classList.add("ring-2", "ring-green", "shadow-card", "max-w-xl", "mx-auto", "scale-[1.02]");
  fillCard(bestNode, best, true);
  bestSlot.appendChild(bestNode);

  const altSlot = document.getElementById("altCardsSlot");
  altSlot.innerHTML = "";
  alts.forEach((tool) => {
    const node = document.getElementById("recCardTemplate").content.cloneNode(true);
    node.querySelector(".rec-card").classList.add("rec-alt");
    fillCard(node, tool, false);
    altSlot.appendChild(node);
  });

  if (window.lucide) lucide.createIcons();
}

function showState(name) {
  ["emptyState", "loadingState", "errorState", "resultsWrap"].forEach((id) => {
    document.getElementById(id).classList.toggle("hidden", id !== name);
  });
}

function runSearch(query, { forceError = false } = {}) {
  if (!query) {
    showState("emptyState");
    return;
  }
  showState("loadingState");

  // Occasionally simulate a slow/failed API response so the retry +
  // friendly-error state (required by the spec) is actually reachable in a
  // frontend-only demo. Real integration would replace this with the
  // Gemini API call's own error handling.
  const shouldError = forceError || Math.random() < 0.12;
  const delay = 700 + Math.random() * 500;

  setTimeout(() => {
    if (shouldError) {
      showState("errorState");
      return;
    }
    const matches = searchTools(query, 3);
    renderResults(matches, query);
    showState("resultsWrap");
  }, delay);
}

document.addEventListener("DOMContentLoaded", () => {
  requireAuth();
  renderShell("home");
  initSearchBar({
    inputId: "resultsSearchInput",
    formId: "resultsSearchForm",
    suggestId: "resultsSuggestions",
    micId: "resultsMicBtn",
    handleSubmit: false,
  });

  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") || "";
  document.getElementById("resultsSearchInput").value = query;

  let lastQuery = query;
  runSearch(query);

  document.getElementById("resultsSearchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("resultsSearchInput").value.trim();
    if (!q) return;
    lastQuery = q;
    addHistory(q);
    history.replaceState(null, "", `results.html?q=${encodeURIComponent(q)}`);
    runSearch(q);
  });

  document.getElementById("retryBtn").addEventListener("click", () => {
    runSearch(lastQuery);
  });
});
