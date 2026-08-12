// Mock catalog standing in for the Gemini-powered recommendation API.
// Each tool carries the keywords it should surface for, so search() can
// score and rank a query without a live backend.
const AI_TOOLS = [
  {
    id: "writesonic",
    name: "Writesonic",
    category: "Writing Assistant",
    pricing: "hybrid",
    rating: 4.6,
    description: "Drafts long-form articles and marketing copy from a short brief, then lets you refine tone in a few clicks.",
    pros: ["Fast first drafts", "Built-in SEO checker", "Brand voice presets"],
    cons: ["Long-form needs heavy editing", "Credits burn quickly on revisions"],
    url: "https://writesonic.com",
    keywords: ["writing", "content", "blog", "copywriting", "article", "marketing", "text"],
  },
  {
    id: "jasper",
    name: "Jasper",
    category: "Writing Assistant",
    pricing: "paid",
    rating: 4.5,
    description: "Enterprise-grade copywriting with brand voice controls, ideal for teams shipping content at scale.",
    pros: ["Strong brand-voice consistency", "Team collaboration tools", "Wide template library"],
    cons: ["Pricier than most alternatives", "Overkill for solo use"],
    url: "https://jasper.ai",
    keywords: ["writing", "content", "marketing", "copywriting", "team", "brand"],
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    category: "Productivity",
    pricing: "hybrid",
    rating: 4.4,
    description: "Summarizes, drafts, and organizes notes right inside the docs you already keep for class or work.",
    pros: ["Lives inside your existing notes", "Great for meeting summaries", "Simple, low learning curve"],
    cons: ["Limited outside the Notion app", "Not built for long research tasks"],
    url: "https://notion.so/product/ai",
    keywords: ["notes", "productivity", "students", "study", "organize", "summarize", "meeting"],
  },
  {
    id: "grammarly",
    name: "Grammarly",
    category: "Writing Assistant",
    pricing: "hybrid",
    rating: 4.7,
    description: "Cleans up grammar, tone, and clarity in real time across your browser, docs, and email.",
    pros: ["Works everywhere you type", "Clear tone suggestions", "Reliable free tier"],
    cons: ["Premium rewrite features are paid", "Occasional over-correction"],
    url: "https://grammarly.com",
    keywords: ["writing", "grammar", "editing", "proofreading", "email", "students", "essay"],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    category: "Research Assistant",
    pricing: "hybrid",
    rating: 4.6,
    description: "Answers research questions with cited sources, so you can verify every claim it makes.",
    pros: ["Inline citations", "Fast, focused answers", "Good for literature scans"],
    cons: ["Deep-dive mode needs a subscription", "Can miss niche sources"],
    url: "https://perplexity.ai",
    keywords: ["research", "study", "sources", "citations", "students", "search", "academic"],
  },
  {
    id: "elicit",
    name: "Elicit",
    category: "Research Assistant",
    pricing: "free",
    rating: 4.3,
    description: "Searches academic papers and extracts key findings into a comparison table for your review.",
    pros: ["Great for literature reviews", "Structured paper comparisons", "Free tier covers most students"],
    cons: ["Narrow to academic sources", "Table exports need cleanup"],
    url: "https://elicit.com",
    keywords: ["research", "academic", "papers", "students", "study", "citations"],
  },
  {
    id: "canva-magic",
    name: "Canva Magic Studio",
    category: "Design",
    pricing: "hybrid",
    rating: 4.5,
    description: "Turns a plain prompt into a presentation, poster, or social post with editable layers.",
    pros: ["Huge template library", "Beginner friendly", "One-click resizing across formats"],
    cons: ["Best features are paid", "Less control than dedicated design tools"],
    url: "https://canva.com/magic-studio",
    keywords: ["design", "presentation", "slides", "poster", "graphics", "social media", "visual"],
  },
  {
    id: "gamma",
    name: "Gamma",
    category: "Presentations",
    pricing: "hybrid",
    rating: 4.5,
    description: "Builds a full slide deck from an outline, with layout and design handled automatically.",
    pros: ["Fastest way to a first draft deck", "Clean default design", "Easy to reorder sections"],
    cons: ["Custom branding is limited", "Export formatting can drift"],
    url: "https://gamma.app",
    keywords: ["presentation", "slides", "deck", "pitch", "students", "work"],
  },
  {
    id: "leonardo",
    name: "Leonardo AI",
    category: "Image Generation",
    pricing: "free",
    rating: 4.4,
    description: "Generates and fine-tunes images with community models, with a usable free daily allowance.",
    pros: ["Generous free tier", "Fine-grained style controls", "Active model community"],
    cons: ["Queue times at peak hours", "Best models are paid"],
    url: "https://leonardo.ai",
    keywords: ["image", "art", "design", "graphics", "free", "creative", "visual"],
  },
  {
    id: "ideogram",
    name: "Ideogram",
    category: "Image Generation",
    pricing: "free",
    rating: 4.3,
    description: "Specializes in generating images with clean, legible text baked into the artwork.",
    pros: ["Best-in-class text rendering", "Free daily credits", "Simple prompt interface"],
    cons: ["Less flexible for photorealism", "Upscaling needs a paid plan"],
    url: "https://ideogram.ai",
    keywords: ["image", "art", "design", "poster", "free", "graphics"],
  },
  {
    id: "otter",
    name: "Otter.ai",
    category: "Transcription",
    pricing: "hybrid",
    rating: 4.4,
    description: "Transcribes meetings and lectures live, then summarizes action items automatically.",
    pros: ["Accurate live transcription", "Auto action-item summaries", "Solid free tier for students"],
    cons: ["Accents can trip accuracy", "Long recordings need paid minutes"],
    url: "https://otter.ai",
    keywords: ["transcription", "meeting", "notes", "lecture", "students", "audio", "summarize"],
  },
  {
    id: "codeium",
    name: "Codeium",
    category: "Coding Assistant",
    pricing: "free",
    rating: 4.5,
    description: "Autocompletes and explains code across most editors, with a genuinely usable free tier.",
    pros: ["Free for individuals", "Wide editor support", "Fast inline suggestions"],
    cons: ["Chat mode weaker than paid rivals", "Occasional irrelevant completions"],
    url: "https://codeium.com",
    keywords: ["coding", "code", "developer", "programming", "software", "free", "engineering"],
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "Coding Assistant",
    pricing: "hybrid",
    rating: 4.7,
    description: "An AI-native code editor that can refactor, explain, and write across your whole project.",
    pros: ["Understands full codebase context", "Fast multi-file edits", "Familiar VS Code-like feel"],
    cons: ["Heavy use needs a paid plan", "Can be resource-hungry"],
    url: "https://cursor.sh",
    keywords: ["coding", "code", "developer", "programming", "software", "engineering", "editor"],
  },
  {
    id: "fireflies",
    name: "Fireflies.ai",
    category: "Productivity",
    pricing: "hybrid",
    rating: 4.3,
    description: "Joins your calls to record, transcribe, and generate a searchable meeting summary.",
    pros: ["Auto-joins scheduled calls", "Searchable transcript archive", "Useful free tier"],
    cons: ["Summary quality varies by accent", "Integrations need paid plan"],
    url: "https://fireflies.ai",
    keywords: ["meeting", "productivity", "transcription", "work", "notes", "summarize"],
  },
  {
    id: "quillbot",
    name: "QuillBot",
    category: "Writing Assistant",
    pricing: "hybrid",
    rating: 4.4,
    description: "Paraphrases and summarizes text quickly, handy for tightening essays and reports.",
    pros: ["Fast paraphrasing modes", "Built-in summarizer", "Free tier covers light use"],
    cons: ["Can flatten nuance if overused", "Citation tools are paid"],
    url: "https://quillbot.com",
    keywords: ["writing", "paraphrase", "summarize", "essay", "students", "editing"],
  },
  {
    id: "synthesia",
    name: "Synthesia",
    category: "Video",
    pricing: "paid",
    rating: 4.4,
    description: "Turns a script into a presenter-led video using AI avatars, no camera required.",
    pros: ["No filming needed", "Wide language and voice set", "Professional avatar library"],
    cons: ["No meaningful free tier", "Avatars can feel stiff"],
    url: "https://synthesia.io",
    keywords: ["video", "presentation", "avatar", "training", "marketing"],
  },
  {
    id: "descript",
    name: "Descript",
    category: "Video",
    pricing: "hybrid",
    rating: 4.5,
    description: "Edits video and podcasts by editing the transcript text, removing filler words automatically.",
    pros: ["Edit video like a text doc", "One-click filler word removal", "Solid free tier"],
    cons: ["Advanced audio tools are paid", "Learning curve for full features"],
    url: "https://descript.com",
    keywords: ["video", "podcast", "editing", "audio", "content", "transcription"],
  },
  {
    id: "clockwise",
    name: "Clockwise",
    category: "Productivity",
    pricing: "free",
    rating: 4.2,
    description: "Rearranges your calendar automatically to protect focus time between meetings.",
    pros: ["Automatic focus-time blocks", "Free for individuals", "Plays well with existing calendars"],
    cons: ["Most useful with a full team on it", "Limited outside Google Calendar"],
    url: "https://getclockwise.com",
    keywords: ["calendar", "productivity", "scheduling", "focus", "work", "time management"],
  },
];

// id -> free-credits label shown on each recommendation card.
const TOOL_CREDITS = {
  "writesonic": "100 free credits",
  "jasper": "No free credits",
  "notion-ai": "50 free credits",
  "grammarly": "Free tier available",
  "perplexity": "5 free Pro searches",
  "elicit": "Unlimited free searches",
  "canva-magic": "50 free credits",
  "gamma": "100 free credits",
  "leonardo": "150 free credits daily",
  "ideogram": "25 free credits daily",
  "otter": "300 free minutes",
  "codeium": "Unlimited free for individuals",
  "cursor": "500 free completions",
  "fireflies": "800 free minutes",
  "quillbot": "125 free words per day",
  "synthesia": "No free credits",
  "descript": "1 hour free transcription",
  "clockwise": "Free for individuals",
};
AI_TOOLS.forEach((t) => { t.credits = TOOL_CREDITS[t.id] || "Not specified"; });

const TRENDING_IDS = ["cursor", "perplexity", "gamma", "leonardo", "codeium", "notion-ai"];

/**
 * Very small keyword scorer: counts overlap between the query's tokens and
 * each tool's keyword/category/description text, then ranks by score.
 * Stands in for the "Gemini decides the fit" step described in the brief.
 */
function searchTools(query, limit = 3) {
  const q = (query || "").toLowerCase().trim();
  if (!q) return AI_TOOLS.slice(0, limit);
  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = AI_TOOLS.map((tool) => {
    const haystack = [tool.name, tool.category, tool.description, ...tool.keywords]
      .join(" ")
      .toLowerCase();
    let score = 0;
    tokens.forEach((t) => {
      if (haystack.includes(t)) score += 1;
      if (tool.keywords.some((k) => k.startsWith(t))) score += 1;
    });
    return { tool, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const ranked = scored.filter((s) => s.score > 0);
  const pool = ranked.length ? ranked : scored;
  return pool.slice(0, limit).map((s) => s.tool);
}

function suggestQueries(partial) {
  const p = (partial || "").toLowerCase().trim();
  if (!p) return [];
  const pool = [
    "AI tools for presentations",
    "best AI tools for students",
    "AI tools for writing content",
    "free AI image generator",
    "AI tools for research",
    "AI coding assistant",
    "AI meeting notes",
    "AI video editor",
    "AI for summarizing papers",
    "AI calendar assistant",
  ];
  return pool.filter((s) => s.toLowerCase().includes(p)).slice(0, 5);
}
