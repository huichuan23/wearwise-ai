import { hasAny, uniqueTags } from "@/lib/utils/tags";

export function aiTagProduct(input) {
  const text = `${input.title} ${input.description}`.toLowerCase();
  const category = inferCategory(text);
  const style = inferStyleTags(text, category);
  const occasion = inferOccasionTags(text, style, category);
  const fit = inferFitTags(text, category);
  const avoid = inferAvoidTags(text, category);
  const confidence = Math.min(96, 62 + style.length * 5 + occasion.length * 4 + fit.length * 3);

  return {
    id: `product-${Date.now()}`,
    name: input.title.trim(),
    category,
    price: Number(input.price) || 39,
    style,
    occasion,
    fit,
    avoid,
    asin: input.asin.trim() || "ASIN-PENDING",
    amazonUrl: input.amazonUrl.trim(),
    status: "active",
    confidence,
    aiNotes: buildTaggerNotes(category, style, occasion, fit, avoid),
  };
}

function inferCategory(text) {
  if (hasAny(text, ["loafer", "sneaker", "boot", "heel", "flat", "sandal", "shoe"])) return "Shoes";
  if (hasAny(text, ["blazer", "jacket", "coat", "cardigan", "trench"])) return "Outerwear";
  if (hasAny(text, ["trouser", "pant", "jean", "legging", "skirt", "short"])) return "Bottom";
  if (hasAny(text, ["dress", "jumpsuit"])) return "One Piece";
  return "Top";
}

function inferStyleTags(text, category) {
  const tags = [];
  if (hasAny(text, ["minimal", "basic", "essential", "clean", "solid"])) tags.push("minimal");
  if (hasAny(text, ["office", "work", "business", "polished", "professional", "blazer", "trouser"])) tags.push("business");
  if (hasAny(text, ["classic", "timeless", "button down", "loafer", "straight"])) tags.push("classic");
  if (hasAny(text, ["sneaker", "stretch", "lounge", "athletic", "active", "jogger"])) tags.push("athleisure");
  if (hasAny(text, ["preppy", "pleated", "polo", "cardigan", "loafer"])) tags.push("preppy");
  if (!tags.length) tags.push(category === "Shoes" ? "classic" : "minimal");
  return uniqueTags(tags);
}

function inferOccasionTags(text, style, category) {
  const tags = [];
  if (hasAny(text, ["office", "work", "business", "professional", "blazer", "loafer"])) tags.push("work");
  if (hasAny(text, ["casual", "weekend", "daily", "everyday", "sneaker", "tee"])) tags.push("casual");
  if (hasAny(text, ["date", "dinner", "party", "dressy", "silky"])) tags.push("date");
  if (hasAny(text, ["travel", "comfortable", "stretch", "lightweight", "packable"])) tags.push("travel");
  if (!tags.length) {
    if (style.includes("business")) tags.push("work");
    if (style.includes("athleisure")) tags.push("casual", "travel");
    if (category === "Shoes") tags.push("casual");
  }
  return uniqueTags(tags.length ? tags : ["casual"]);
}

function inferFitTags(text, category) {
  const tags = [];
  if (hasAny(text, ["high waist", "high-waist", "high rise", "high-rise", "cropped", "ankle"])) tags.push("petite");
  if (hasAny(text, ["long", "tall", "inseam"])) tags.push("tall");
  if (hasAny(text, ["curvy", "wide leg", "a-line", "straight leg", "straight-leg"])) tags.push("pear");
  if (hasAny(text, ["relaxed", "flowy", "drape", "tunic", "cardigan"])) tags.push("apple");
  if (hasAny(text, ["stretch", "plus", "elastic", "comfortable"])) tags.push("plus");
  if (hasAny(text, ["structured", "tailored", "straight", "boxy"])) tags.push("rectangle");
  if (!tags.length) tags.push(category === "Bottom" ? "pear" : "rectangle");
  return uniqueTags(tags);
}

function inferAvoidTags(text, category) {
  const tags = [];
  if (hasAny(text, ["bodycon", "tight", "slim fit", "fitted", "crop top"])) tags.push("apple");
  if (hasAny(text, ["oversized", "longline", "maxi"])) tags.push("petite");
  if (hasAny(text, ["low rise", "low-rise"])) tags.push("petite", "pear");
  if (category === "Outerwear" && hasAny(text, ["double breasted", "padded shoulder"])) tags.push("apple");
  return uniqueTags(tags);
}

function buildTaggerNotes(category, style, occasion, fit, avoid) {
  const avoidLine = avoid.length ? `Avoid for: ${avoid.join(", ")}.` : "No strong body-type avoid signal found.";
  return `${category} tagged as ${style.join(", ")} for ${occasion.join(", ")}. Fit signals: ${fit.join(", ")}. ${avoidLine}`;
}
