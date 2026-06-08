"use client";

import { useEffect, useMemo, useState } from "react";
import { FormulaManager, FeedbackMemory, ProductPool } from "@/components/AdminPanels";
import ProductTagger from "@/components/ProductTagger";
import RecommendationCard from "@/components/RecommendationCard";
import StyleQuiz from "@/components/StyleQuiz";
import { STORAGE, seedFormulas, seedProducts } from "@/lib/data/seedData";
import { generateRecommendations } from "@/lib/recommendation/engine";
import { loadList, loadObject, saveList, saveObject } from "@/lib/storage/localStorage";

const defaultFormState = {
  height: "average",
  bodyType: "rectangle",
  sizeRange: "m",
  fitPreference: "relaxed",
  dressCode: "business casual",
  climate: "mixed",
  goal: "look polished",
  shoePreference: "any",
  colors: "",
  avoid: "",
  photo: "",
};

const defaultSegmentState = {
  occasion: "work",
  style: "minimal",
  budget: "150",
};

export default function HomePage() {
  const [hydrated, setHydrated] = useState(false);
  const [products, setProducts] = useState(seedProducts);
  const [formulas, setFormulas] = useState(seedFormulas);
  const [feedback, setFeedback] = useState([]);
  const [formState, setFormState] = useState(defaultFormState);
  const [segmentState, setSegmentState] = useState(defaultSegmentState);
  const [profile, setProfile] = useState(buildProfile(defaultFormState, defaultSegmentState));

  useEffect(() => {
    const savedProfile = loadObject(STORAGE.profile, null);
    setProducts(loadList(STORAGE.products, seedProducts));
    setFormulas(loadList(STORAGE.formulas, seedFormulas));
    setFeedback(loadList(STORAGE.feedback, []));
    if (savedProfile) {
      setFormState({
        ...defaultFormState,
        ...savedProfile,
        colors: Array.isArray(savedProfile.colors) ? savedProfile.colors.join(", ") : "",
        avoid: Array.isArray(savedProfile.avoid) ? savedProfile.avoid.join(", ") : "",
        photo: savedProfile.photoName || "",
      });
      setSegmentState({
        occasion: savedProfile.occasion || "work",
        style: savedProfile.style || "minimal",
        budget: String(savedProfile.budget || "150"),
      });
      setProfile(savedProfile);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveList(STORAGE.products, products);
  }, [hydrated, products]);

  useEffect(() => {
    if (hydrated) saveList(STORAGE.formulas, formulas);
  }, [hydrated, formulas]);

  useEffect(() => {
    if (hydrated) saveList(STORAGE.feedback, feedback);
  }, [hydrated, feedback]);

  const recommendations = useMemo(
    () => generateRecommendations({ formulas, products, profile, feedback }),
    [feedback, formulas, products, profile],
  );

  function handleSegmentChange(group, value) {
    setSegmentState({ ...segmentState, [group]: value });
  }

  function handleGenerate(nextProfile) {
    setProfile(nextProfile);
    saveObject(STORAGE.profile, nextProfile);
  }

  function handleReset() {
    setFormState(defaultFormState);
    setSegmentState(defaultSegmentState);
    const nextProfile = buildProfile(defaultFormState, defaultSegmentState);
    setProfile(nextProfile);
    saveObject(STORAGE.profile, nextProfile);
  }

  function handleFeedback(item) {
    setFeedback([
      ...feedback,
      {
        ...item,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Amazon-first personal stylist</p>
            <h1>WearWise AI</h1>
            <p className="subhead">Amazon outfits picked for your body, budget, and occasion.</p>
          </div>
          <div className="status-strip" aria-label="Prototype status">
            <span>North America MVP</span>
            <span>AI tagging</span>
            <span>Local memory</span>
          </div>
        </header>

        <div className="main-grid">
          <StyleQuiz
            formState={formState}
            onFormChange={setFormState}
            segmentState={segmentState}
            onSegmentChange={handleSegmentChange}
            onGenerate={handleGenerate}
            onReset={handleReset}
          />

          <section className="panel results-panel" aria-labelledby="results-title">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Recommendations</p>
                <h2 id="results-title">Amazon-ready outfit cards</h2>
              </div>
              <span className="count-pill">{recommendations.length} outfits</span>
            </div>
            <ProfileSummary profile={profile} />
            <div className="outfit-list">
              {recommendations.map((item, index) => (
                <RecommendationCard key={item.formula.id} item={item} profile={profile} featured={index === 0} onFeedback={handleFeedback} />
              ))}
            </div>
          </section>
        </div>

        <ProductTagger onAddProduct={(product) => setProducts([product, ...products])} />

        <section className="ops-grid">
          <ProductPool products={products} onDeleteProduct={(id) => setProducts(products.filter((product) => product.id !== id))} onResetProducts={() => setProducts(seedProducts)} />
          <FormulaManager formulas={formulas} onAddFormula={(formula) => setFormulas([formula, ...formulas])} onDeleteFormula={(id) => setFormulas(formulas.filter((formula) => formula.id !== id))} />
          <FeedbackMemory feedback={feedback} onClearFeedback={() => setFeedback([])} />
        </section>

        <section className="compliance-note">
          Amazon prices are estimated in this prototype. Current price and availability should be checked on Amazon.
        </section>
      </section>
    </main>
  );
}

function ProfileSummary({ profile }) {
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

  return (
    <div className="profile-summary">
      {labels.map((label) => (
        <span className="tag" key={label}>{label}</span>
      ))}
    </div>
  );
}

function buildProfile(form, segments) {
  return {
    height: form.height,
    bodyType: form.bodyType,
    sizeRange: form.sizeRange,
    fitPreference: form.fitPreference,
    occasion: segments.occasion,
    style: segments.style,
    budget: Number(segments.budget),
    dressCode: form.dressCode,
    climate: form.climate,
    goal: form.goal,
    shoePreference: form.shoePreference,
    colors: [],
    avoid: [],
    photoName: form.photo || "",
  };
}
