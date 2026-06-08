import { uniqueTags } from "@/lib/utils/tags";

export function getMemory(feedback) {
  const liked = feedback.filter((item) => item.type === "like");
  const disliked = feedback.filter((item) => item.type !== "like");

  return {
    likedProductIds: liked.flatMap((item) => item.productIds || []),
    dislikedProductIds: disliked.flatMap((item) => item.productIds || []),
    likedStyles: uniqueTags(liked.map((item) => item.style)),
    dislikedStyles: uniqueTags(disliked.map((item) => item.style)),
  };
}

export function generateRecommendations({ formulas, products, profile, feedback }) {
  const memory = getMemory(feedback);

  return formulas
    .map((formula) => scoreFormula(formula, profile, memory, products))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function scoreFormula(formula, profile, memory, products) {
  let score = 35;
  if (formula.occasion === profile.occasion) score += 24;
  if (formula.style === profile.style) score += 20;
  if (formula.bodyFit.includes(profile.bodyType) || formula.bodyFit.includes(profile.height)) score += 14;
  if (memory.likedStyles.includes(formula.style)) score += 6;
  if (memory.dislikedStyles.includes(formula.style)) score -= 14;

  const picks = pickProductsForFormula(formula, profile, memory, products);
  const total = picks.reduce((sum, product) => sum + product.price, 0);
  if (total <= profile.budget) score += 10;
  if (total > profile.budget) score -= Math.min(25, Math.ceil((total - profile.budget) / 8));

  for (const product of picks) {
    score += scoreProduct(product, profile, memory);
  }

  return { formula, products: picks, total, score };
}

function pickProductsForFormula(formula, profile, memory, products) {
  const categories = ["Top", "Bottom", "Shoes", "Outerwear"];

  return categories
    .map((category) => {
      const candidates = products
        .filter((product) => product.status !== "inactive" && product.category === category)
        .map((product) => ({ product, score: scoreProduct(product, profile, memory) + categoryBonus(product, formula) }))
        .sort((a, b) => b.score - a.score);
      return candidates[0]?.product;
    })
    .filter(Boolean);
}

function categoryBonus(product, formula) {
  let score = 0;
  if (product.style.includes(formula.style)) score += 10;
  if (product.occasion.includes(formula.occasion)) score += 8;
  return score;
}

function scoreProduct(product, profile, memory) {
  let score = 0;
  if (product.occasion.includes(profile.occasion)) score += 8;
  if (product.style.includes(profile.style)) score += 8;
  if (product.fit.includes(profile.bodyType) || product.fit.includes(profile.height) || product.fit.includes(profile.sizeRange)) score += 7;
  if (product.avoid.includes(profile.bodyType) || product.avoid.includes(profile.height) || product.avoid.includes(profile.sizeRange)) score -= 14;
  if (product.price <= profile.budget / 3) score += 3;
  if (profile.shoePreference === "flats only" && product.category === "Shoes" && /heel/i.test(product.name)) score -= 18;
  if (profile.avoid.some((avoid) => product.name.toLowerCase().includes(avoid))) score -= 16;
  if (memory.likedProductIds.includes(product.id)) score += 8;
  if (memory.dislikedProductIds.includes(product.id)) score -= 18;
  if (product.style.some((tag) => memory.likedStyles.includes(tag))) score += 4;
  if (product.style.some((tag) => memory.dislikedStyles.includes(tag))) score -= 8;
  return score;
}

export function buildAmazonUrl(productsForOutfit) {
  const direct = productsForOutfit.find((product) => product.amazonUrl)?.amazonUrl;
  if (direct) return direct;
  const query = encodeURIComponent(productsForOutfit.map((product) => product.name).join(" "));
  return `https://www.amazon.com/s?k=${query}`;
}

export function buildReasonBlocks(item, profile) {
  const fitTags = item.products
    .flatMap((product) => product.fit)
    .filter((tag, index, list) => list.indexOf(tag) === index)
    .slice(0, 4)
    .join(", ");

  return [
    { title: "Why it works", body: item.formula.note },
    { title: "Body fit logic", body: `Built around ${profile.bodyType}/${profile.height} signals, with products tagged for ${fitTags}.` },
    { title: "Occasion fit", body: `Designed for ${profile.occasion} with a ${profile.dressCode} dress-code signal.` },
    {
      title: "Budget",
      body:
        item.total <= profile.budget
          ? `Estimated total stays inside the selected $${profile.budget} budget.`
          : "Estimated total is above budget, so use this as an upgrade option or swap one item.",
    },
    { title: "What to avoid", body: profile.avoid.length ? `Avoid list checked against: ${profile.avoid.join(", ")}.` : "No avoid terms were entered." },
    { title: "Swap option", body: "Replace the highest-price item first if the Amazon price changes." },
  ];
}
