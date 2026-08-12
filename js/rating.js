// js/rating.js
const RATINGS_KEY = "distill_ratings";

function getRatings() {
  try {
    return JSON.parse(localStorage.getItem(RATINGS_KEY)) || {};
  } catch {
    return {};
  }
}

function setRating(toolId, userEmail, stars) {
  const ratings = getRatings();
  if (!ratings[toolId]) ratings[toolId] = [];
  const existing = ratings[toolId].find(r => r.user === userEmail);
  if (existing) existing.rating = stars;
  else ratings[toolId].push({ user: userEmail, rating: stars });
  localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
}

function getAvgRating(toolId) {
  const ratings = getRatings();
  if (!ratings[toolId] || ratings[toolId].length === 0) return null;
  const sum = ratings[toolId].reduce((a, b) => a + b.rating, 0);
  return sum / ratings[toolId].length;
}

function getRatingCount(toolId) {
  const ratings = getRatings();
  return ratings[toolId] ? ratings[toolId].length : 0;
}