"use client";

import { useState } from "react";
import { aiTagProduct } from "@/lib/ai/productTagger";

const emptyTagger = {
  title: "",
  asin: "",
  price: "",
  amazonUrl: "",
  description: "",
};

export default function ProductTagger({ onAddProduct }) {
  const [form, setForm] = useState(emptyTagger);
  const [tagged, setTagged] = useState(null);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    setTagged(aiTagProduct(form));
  }

  function addTaggedProduct() {
    if (!tagged) return;
    onAddProduct(tagged);
    setTagged(null);
    setForm(emptyTagger);
  }

  return (
    <section className="panel tagger-panel" aria-labelledby="tagger-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">AI operations</p>
          <h2 id="tagger-title">AI product tagger</h2>
        </div>
        <span className="count-pill">Amazon intake</span>
      </div>

      <form className="tagger-form" onSubmit={submit}>
        <div className="field-row three">
          <label>
            Product title
            <input name="title" type="text" value={form.title} onChange={updateField} placeholder="Women's High Waisted Wide Leg Trousers" required />
          </label>
          <label>
            ASIN
            <input name="asin" type="text" value={form.asin} onChange={updateField} placeholder="B0XXXXXXX" />
          </label>
          <label>
            Estimated price
            <input name="price" type="number" min="0" value={form.price} onChange={updateField} placeholder="39" />
          </label>
        </div>
        <label>
          Amazon URL
          <input name="amazonUrl" type="url" value={form.amazonUrl} onChange={updateField} placeholder="https://www.amazon.com/dp/..." />
        </label>
        <label>
          Product description
          <textarea name="description" rows="3" value={form.description} onChange={updateField} placeholder="Paste Amazon bullets, material, fit notes, and review clues." />
        </label>
        <div className="tagger-actions">
          <button className="primary-button" type="submit">AI tag product</button>
          <button className="action-button" type="button" disabled={!tagged} onClick={addTaggedProduct}>Add tagged product</button>
        </div>
      </form>

      {tagged ? <TaggedProduct product={tagged} /> : null}
    </section>
  );
}

function TaggedProduct({ product }) {
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

  return (
    <div className="tagger-output visible">
      <h3>{product.name}</h3>
      <p className="reason">{product.aiNotes}</p>
      <div className="tag-grid">
        {tagGroups.map((tag) => (
          <span className="tag" key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}
