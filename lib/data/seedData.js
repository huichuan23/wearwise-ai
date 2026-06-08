export const STORAGE = {
  products: "wearwise.products",
  formulas: "wearwise.formulas",
  feedback: "wearwise.feedback",
  profile: "wearwise.profile",
};

export function makeProduct(id, name, category, price, style, occasion, fit, avoid, asin, amazonUrl = "") {
  return { id, name, category, price, style, occasion, fit, avoid, asin, amazonUrl, status: "active" };
}

export function makeFormula(id, name, occasion, style, bodyFit, note, image) {
  return { id, name, occasion, style, bodyFit, note, image };
}

export const seedProducts = [
  makeProduct("top-oxford", "Crisp Oxford Shirt", "Top", 34, ["minimal", "business", "classic"], ["work", "travel"], ["rectangle", "pear", "petite", "tall"], ["apple"], "B0EXAMPLE01"),
  makeProduct("top-knit", "Soft Ribbed Knit Tee", "Top", 24, ["minimal", "casual", "classic"], ["casual", "travel", "date"], ["hourglass", "rectangle", "petite"], [], "B0EXAMPLE02"),
  makeProduct("bottom-trouser", "High-Rise Straight Trouser", "Bottom", 46, ["business", "minimal", "classic"], ["work", "date"], ["pear", "petite", "rectangle", "plus"], [], "B0EXAMPLE03"),
  makeProduct("bottom-jean", "Straight-Leg Dark Jean", "Bottom", 42, ["minimal", "classic", "preppy"], ["casual", "travel", "date"], ["pear", "hourglass", "rectangle", "tall"], [], "B0EXAMPLE04"),
  makeProduct("shoe-loafer", "Leather-Look Loafer", "Shoes", 39, ["business", "classic", "preppy"], ["work", "date", "travel"], ["petite", "rectangle", "pear"], [], "B0EXAMPLE05"),
  makeProduct("shoe-sneaker", "Clean White Sneaker", "Shoes", 35, ["minimal", "athleisure", "classic"], ["casual", "travel", "work"], ["petite", "tall", "plus", "rectangle"], [], "B0EXAMPLE06"),
  makeProduct("outer-blazer", "Relaxed Single-Breasted Blazer", "Outerwear", 58, ["business", "classic", "minimal"], ["work", "date"], ["rectangle", "pear", "tall"], ["apple"], "B0EXAMPLE07"),
  makeProduct("outer-cardigan", "Lightweight Long Cardigan", "Outerwear", 31, ["classic", "minimal", "casual"], ["casual", "travel", "work"], ["apple", "plus", "tall"], ["petite"], "B0EXAMPLE08"),
];

export const seedFormulas = [
  makeFormula("formula-work", "Oxford + straight trouser + loafer", "work", "business", ["rectangle", "pear", "petite"], "Polished, structured, and easy to buy as Amazon basics.", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"),
  makeFormula("formula-casual", "Knit tee + dark jean + white sneaker", "casual", "minimal", ["rectangle", "hourglass", "plus"], "A low-risk casual formula with clean proportions.", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"),
  makeFormula("formula-date", "Blazer + dark jean + loafer", "date", "classic", ["pear", "rectangle", "tall"], "Smart casual without looking overdressed.", "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80"),
  makeFormula("formula-travel", "Cardigan + straight trouser + sneaker", "travel", "athleisure", ["apple", "plus", "tall"], "Comfort-first pieces that still look intentional.", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80"),
];
