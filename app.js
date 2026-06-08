const STORAGE = {
  products: "wearwise.products",
  formulas: "wearwise.formulas",
  feedback: "wearwise.feedback",
  profile: "wearwise.profile",
};

const seedProducts = [
  makeProduct("top-oxford", "Crisp Oxford Shirt", "Top", 34, ["minimal", "business", "classic"], ["work", "travel"], ["rectangle", "pear", "petite", "tall"], ["apple"], "B0EXAMPLE01"),
  makeProduct("top-knit", "Soft Ribbed Knit Tee", "Top", 24, ["minimal", "casual", "classic"], ["casual", "travel", "date"], ["hourglass", "rectangle", "petite"], [], "B0EXAMPLE02"),
  makeProduct("bottom-trouser", "High-Rise Straight Trouser", "Bottom", 46, ["business", "minimal", "classic"], ["work", "date"], ["pear", "petite", "rectangle", "plus"], [], "B0EXAMPLE03"),
  makeProduct("bottom-jean", "Straight-Leg Dark Jean", "Bottom", 42, ["minimal", "classic", "preppy"], ["casual", "travel", "date"], ["pear", "hourglass", "rectangle", "tall"], [], "B0EXAMPLE04"),
  makeProduct("shoe-loafer", "Leather-Look Loafer", "Shoes", 39, ["business", "classic", "preppy"], ["work", "date", "travel"], ["petite", "rectangle", "pear"], [], "B0EXAMPLE05"),
  makeProduct("shoe-sneaker", "Clean White Sneaker", "Shoes", 35, ["minimal", "athleisure", "classic"], ["casual", "travel", "work"], ["petite", "tall", "plus", "rectangle"], [], "B0EXAMPLE06"),
  makeProduct("outer-blazer", "Relaxed Single-Breasted Blazer", "Outerwear", 58, ["business", "classic", "minimal"], ["work", "date"], ["rectangle", "pear", "tall"], ["apple"], "B0EXAMPLE07"),
  makeProduct("outer-cardigan", "Lightweight Long Cardigan", "Outerwear", 31, ["classic", "minimal", "casual"], ["casual", "travel", "work"], ["apple", "plus", "tall"], ["petite"], "B0EXAMPLE08"),
];

const seedFormulas = [
  makeFormula("formula-work", "Oxford + straight trouser + loafer", "work", "business", ["rectangle", "pear", "petite"], "Polished, structured, and easy to buy as Amazon basics.", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"),
  makeFormula("formula-casual", "Knit tee + dark jean + white sneaker", "casual", "minimal", ["rectangle", "hourglass", "plus"], "A low-risk casual formula with clean proportions.", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"),
  makeFormula("formula-date", "Blazer + dark jean + loafer", "date", "classic", ["pear", "rectangle", "tall"], "Smart casual without looking overdressed.", "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80"),
  makeFormula("formula-travel", "Cardigan + straight trouser + sneaker", "travel", "athleisure", ["apple", "plus", "tall"], "Comfort-first pieces that still look intentional.", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80"),
];

let products = loadList(STORAGE.products, seedProducts);
let formulas = loadList(STORAGE.formulas, seedFormulas);
let feedback = loadList(STORAGE.feedback, []);
let pendingTaggedProduct = null;

const state = {
  occasion: "work",
  style: "minimal",
  budget: 150,
};

const byId = (id) => document.getElementById(id);

function makeProduct(id, name, category, price, style, occasion, fit, avoid, asin, amazonUrl = "") {
  return { id, name, category, price, style, occasion, fit, avoid, asin, amazonUrl, status: "active" };
}

function makeFormula(id, name, occasion, style, bodyFit, note, image) {
  return { id, name, occasion, style, bodyFit, note, image };
}

function loadList(key, fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    if (Array.isArray(saved)) return saved;
  } catch (error) {
    console.warn(`Could not load ${key}`, error);
  }
  return fallback;
}

function saveList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getProfile() {
  const form = byId("styleForm");
  const data = new FormData(form);
  const profile = {
    height: data.get("height"),
    bodyType: data.get("bodyType"),
    sizeRange: data.get("sizeRange"),
    fitPreference: data.get("fitPreference"),
    occasion: state.occasion,
    style: state.style,
    budget: Number(state.budget),
    dressCode: data.get("dressCode"),
    climate: data.get("climate"),
    goal: data.get("goal"),
    shoePreference: data.get("shoePreference"),
    colors: splitInput(data.get("colors")),
    avoid: splitInput(data.get("avoid")),
    photoName: data.get("photo")?.name || "",
  };
  localStorage.setItem(STORAGE.profile, JSON.stringify(profile));
  return profile;
}

function splitInput(value) {
  return String(value || "")
    .toLowerCase()
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function scoreFormula(formula, profile, memory) {
  let score = 35;
  if (formula.occasion === profile.occasion) score += 24;
  if (formula.style === profile.style) score += 20;
  if (formula.bodyFit.includes(profile.bodyType) || formula.bodyFit.includes(profile.height)) score += 14;
  if (memory.likedStyles.includes(formula.style)) score += 6;
  if (memory.dislikedStyles.includes(formula.style)) score -= 14;

  const picks = pickProductsForFormula(formula, profile, memory);
  const total = picks.reduce((sum, product) => sum + product.price, 0);
  if (total <= profile.budget) score += 10;
  if (total > profile.budget) score -= Math.min(25, Math.ceil((total - profile.budget) / 8));

  for (const product of picks) {
    score += scoreProduct(product, profile, memory);
  }

  return { formula, products: picks, total, score };
}

function pickProductsForFormula(formula, profile, memory) {
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

function getMemory() {
  const liked = feedback.filter((item) => item.type === "like");
  const disliked = feedback.filter((item) => item.type !== "like");
  return {
    likedProductIds: liked.flatMap((item) => item.productIds || []),
    dislikedProductIds: disliked.flatMap((item) => item.productIds || []),
    likedStyles: uniqueTags(liked.map((item) => item.style)),
    dislikedStyles: uniqueTags(disliked.map((item) => item.style)),
  };
}

function generateRecommendations(event) {
  if (event) event.preventDefault();
  const profile = getProfile();
  const memory = getMemory();
  const ranked = formulas
    .map((formula) => scoreFormula(formula, profile, memory))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  renderProfile(profile);
  renderOutfits(ranked, profile);
}

function renderProfile(profile) {
  const labels = [
    profile.height,
    profile.bodyType,
    profile.sizeRange,
    profile.fitPreference,
    profile.occasion,
    profile.style,
    `under $${profile.budget}`,
    profile.goal,
    profile.photoName ? "photo attached" : "manual body profile",
  ];
  byId("profileSummary").innerHTML = labels.map((label) => `<span class="tag">${label}</span>`).join("");
}

function renderOutfits(items, profile) {
  byId("resultCount").textContent = `${items.length} outfits`;
  byId("outfitList").innerHTML = items
    .map((item, index) => {
      const match = Math.max(0, Math.min(100, Math.round(item.score)));
      const amazonUrl = buildAmazonUrl(item.products);
      return `
        <article class="outfit-card ${index === 0 ? "featured" : ""}">
          <div class="outfit-cover">
            <div class="outfit-image" style="background-image:url('${item.formula.image}')"></div>
            <div class="outfit-copy">
              <h3>${item.formula.name}</h3>
              <div class="outfit-meta">
                <span class="tag">Est. $${item.total}</span>
                <span class="tag">${match}/100 match</span>
                <span class="tag">${item.formula.occasion}</span>
                <span class="tag">${item.formula.style}</span>
              </div>
              ${buildStructuredReason(item, profile)}
            </div>
          </div>
          <div class="product-row">
            ${item.products
              .slice(0, 4)
              .map(
                (product) => `
                <div class="product-card">
                  <strong>${product.name}</strong>
                  <span>${product.category} - est. $${product.price}</span>
                  <span>ASIN ${product.asin}</span>
                </div>
              `,
              )
              .join("")}
          </div>
          <div class="outfit-actions">
            <a class="amazon-link" href="${amazonUrl}" target="_blank" rel="noreferrer">View on Amazon</a>
            <button class="action-button" type="button" data-feedback="like" data-formula="${item.formula.name}" data-style="${item.formula.style}" data-product-ids="${item.products.map((product) => product.id).join(",")}">Like</button>
            <button class="action-button" type="button" data-feedback="not my style" data-formula="${item.formula.name}" data-style="${item.formula.style}" data-product-ids="${item.products.map((product) => product.id).join(",")}">Not my style</button>
            <button class="action-button" type="button" data-feedback="too expensive" data-formula="${item.formula.name}" data-style="${item.formula.style}" data-product-ids="${item.products.map((product) => product.id).join(",")}">Too expensive</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function buildAmazonUrl(productsForOutfit) {
  const direct = productsForOutfit.find((product) => product.amazonUrl)?.amazonUrl;
  if (direct) return direct;
  const query = encodeURIComponent(productsForOutfit.map((product) => product.name).join(" "));
  return `https://www.amazon.com/s?k=${query}`;
}

function buildStructuredReason(item, profile) {
  const fitLine = `Built around ${profile.bodyType}/${profile.height} signals, with products tagged for ${item.products
    .flatMap((product) => product.fit)
    .filter((tag, index, list) => list.indexOf(tag) === index)
    .slice(0, 4)
    .join(", ")}.`;
  const budgetLine =
    item.total <= profile.budget
      ? `Estimated total stays inside the selected $${profile.budget} budget.`
      : `Estimated total is above budget, so use this as an upgrade option or swap one item.`;
  const avoidLine = profile.avoid.length
    ? `Avoid list checked against: ${profile.avoid.join(", ")}.`
    : "No avoid terms were entered.";
  return `
    <div class="reason-grid">
      <p><strong>Why it works</strong>${item.formula.note}</p>
      <p><strong>Body fit logic</strong>${fitLine}</p>
      <p><strong>Occasion fit</strong>Designed for ${profile.occasion} with a ${profile.dressCode} dress-code signal.</p>
      <p><strong>Budget</strong>${budgetLine}</p>
      <p><strong>What to avoid</strong>${avoidLine}</p>
      <p><strong>Swap option</strong>Replace the highest-price item first if the Amazon price changes.</p>
    </div>
  `;
}

function renderAdminPools() {
  byId("productPool").innerHTML = products
    .map(
      (product) => `
      <div class="compact-item">
        <div class="item-header">
          <strong>${product.name}</strong>
          <button class="text-button" type="button" data-delete-product="${product.id}">Delete</button>
        </div>
        <p>${product.category} - est. $${product.price} - ${product.style.join(", ")} - ${product.occasion.join(", ")}</p>
        <p>Fit: ${product.fit.join(", ")}${product.avoid.length ? ` - Avoid: ${product.avoid.join(", ")}` : ""}</p>
      </div>
    `,
    )
    .join("");

  byId("formulaPool").innerHTML = formulas
    .map(
      (formula) => `
      <div class="compact-item">
        <div class="item-header">
          <strong>${formula.name}</strong>
          <button class="text-button" type="button" data-delete-formula="${formula.id}">Delete</button>
        </div>
        <p>${formula.occasion} - ${formula.style} - fit: ${formula.bodyFit.join(", ")}</p>
      </div>
    `,
    )
    .join("");
}

function renderFeedback() {
  if (!feedback.length) {
    byId("feedbackList").innerHTML = `
      <div class="feedback-item">
        <strong>No feedback yet</strong>
        <p>User reactions will be stored here and reused in the next recommendation.</p>
      </div>
    `;
    return;
  }

  byId("feedbackList").innerHTML = feedback
    .slice()
    .reverse()
    .map(
      (item) => `
      <div class="feedback-item">
        <strong>${item.type}</strong>
        <p>${item.formula} - ${item.time}</p>
      </div>
    `,
    )
    .join("");
}

function uniqueTags(tags) {
  return [...new Set(tags.filter(Boolean))];
}

function hasAny(text, words) {
  return words.some((word) => text.includes(word));
}

function aiTagProduct(input) {
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

function renderTaggedProduct(product) {
  const tagGroups = [
    `Category: ${product.category}`,
    `Est. $${product.price}`,
    `ASIN: ${product.asin}`,
    `Confidence: ${product.confidence}%`,
    ...product.style.map((tag) => `Style: ${tag}`),
    ...product.occasion.map((tag) => `Occasion: ${tag}`),
    ...product.fit.map((tag) => `Fit: ${tag}`),
    ...product.avoid.map((tag) => `Avoid: ${tag}`),
  ];

  const output = byId("taggerOutput");
  output.classList.add("visible");
  output.innerHTML = `
    <h3>${product.name}</h3>
    <p class="reason">${product.aiNotes}</p>
    <div class="tag-grid">
      ${tagGroups.map((tag) => `<span class="tag">${tag}</span>`).join("")}
    </div>
  `;
}

function wireSegmentedControls() {
  document.querySelectorAll(".segmented").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      group.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state[group.dataset.group] = button.dataset.value;
    });
  });
}

function wireFeedback() {
  byId("outfitList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-feedback]");
    if (!button) return;
    feedback.push({
      type: button.dataset.feedback,
      formula: button.dataset.formula,
      style: button.dataset.style,
      productIds: splitInput(button.dataset.productIds),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    saveList(STORAGE.feedback, feedback);
    renderFeedback();
    generateRecommendations();
  });
}

function wireProductTagger() {
  byId("taggerForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    pendingTaggedProduct = aiTagProduct({
      title: String(data.get("title") || ""),
      asin: String(data.get("asin") || ""),
      price: String(data.get("price") || ""),
      amazonUrl: String(data.get("amazonUrl") || ""),
      description: String(data.get("description") || ""),
    });
    renderTaggedProduct(pendingTaggedProduct);
    byId("addTaggedProductBtn").disabled = false;
  });

  byId("addTaggedProductBtn").addEventListener("click", () => {
    if (!pendingTaggedProduct) return;
    products = [pendingTaggedProduct, ...products];
    saveList(STORAGE.products, products);
    renderAdminPools();
    generateRecommendations();
    byId("addTaggedProductBtn").disabled = true;
  });
}

function wireAdmin() {
  byId("productPool").addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-product]");
    if (!button) return;
    products = products.filter((product) => product.id !== button.dataset.deleteProduct);
    saveList(STORAGE.products, products);
    renderAdminPools();
    generateRecommendations();
  });

  byId("formulaPool").addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-formula]");
    if (!button) return;
    formulas = formulas.filter((formula) => formula.id !== button.dataset.deleteFormula);
    saveList(STORAGE.formulas, formulas);
    renderAdminPools();
    generateRecommendations();
  });

  byId("formulaForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    formulas = [
      makeFormula(
        `formula-${Date.now()}`,
        String(data.get("name") || "Custom formula"),
        String(data.get("occasion") || "casual"),
        String(data.get("style") || "minimal"),
        ["petite", "rectangle", "pear", "plus"],
        String(data.get("note") || "Custom formula created from admin input."),
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
      ),
      ...formulas,
    ];
    saveList(STORAGE.formulas, formulas);
    event.currentTarget.reset();
    renderAdminPools();
    generateRecommendations();
  });

  byId("resetProductsBtn").addEventListener("click", () => {
    products = seedProducts;
    saveList(STORAGE.products, products);
    renderAdminPools();
    generateRecommendations();
  });

  byId("clearFeedbackBtn").addEventListener("click", () => {
    feedback = [];
    saveList(STORAGE.feedback, feedback);
    renderFeedback();
    generateRecommendations();
  });
}

function resetQuiz() {
  byId("styleForm").reset();
  state.occasion = "work";
  state.style = "minimal";
  state.budget = 150;
  document.querySelectorAll(".segmented").forEach((group) => {
    group.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
    const defaultValue = group.dataset.group === "budget" ? "150" : group.dataset.group === "occasion" ? "work" : "minimal";
    group.querySelector(`[data-value="${defaultValue}"]`).classList.add("active");
  });
  generateRecommendations();
}

function restoreProfile() {
  try {
    const profile = JSON.parse(localStorage.getItem(STORAGE.profile) || "null");
    if (!profile) return;
    const form = byId("styleForm");
    for (const [key, value] of Object.entries(profile)) {
      const field = form.elements[key];
      if (!field || key === "photoName") continue;
      field.value = Array.isArray(value) ? value.join(", ") : value;
    }
    state.occasion = profile.occasion || state.occasion;
    state.style = profile.style || state.style;
    state.budget = profile.budget || state.budget;
    document.querySelectorAll(".segmented").forEach((group) => {
      group.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.value === String(state[group.dataset.group])));
    });
  } catch (error) {
    console.warn("Could not restore profile", error);
  }
}

byId("styleForm").addEventListener("submit", generateRecommendations);
byId("resetBtn").addEventListener("click", resetQuiz);
wireSegmentedControls();
wireFeedback();
wireProductTagger();
wireAdmin();
restoreProfile();
renderAdminPools();
renderFeedback();
generateRecommendations();
