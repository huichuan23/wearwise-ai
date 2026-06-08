"use client";

import { useState } from "react";
import { makeFormula } from "@/lib/data/seedData";

export function ProductPool({ products, onDeleteProduct, onResetProducts }) {
  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Admin</p>
          <h2>Product pool</h2>
        </div>
        <button className="action-button small" type="button" onClick={onResetProducts}>Reset</button>
      </div>
      <div className="compact-list">
        {products.map((product) => (
          <div className="compact-item" key={product.id}>
            <div className="item-header">
              <strong>{product.name}</strong>
              <button className="text-button" type="button" onClick={() => onDeleteProduct(product.id)}>Delete</button>
            </div>
            <p>{product.category} - est. ${product.price} - {product.style.join(", ")} - {product.occasion.join(", ")}</p>
            <p>Fit: {product.fit.join(", ")}{product.avoid.length ? ` - Avoid: ${product.avoid.join(", ")}` : ""}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormulaManager({ formulas, onAddFormula, onDeleteFormula }) {
  const [form, setForm] = useState({ name: "", occasion: "work", style: "minimal", note: "" });

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    onAddFormula(
      makeFormula(
        `formula-${Date.now()}`,
        form.name || "Custom formula",
        form.occasion,
        form.style,
        ["petite", "rectangle", "pear", "plus"],
        form.note || "Custom formula created from admin input.",
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
      ),
    );
    setForm({ name: "", occasion: "work", style: "minimal", note: "" });
  }

  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Admin</p>
          <h2>Outfit formulas</h2>
        </div>
      </div>
      <form className="mini-form" onSubmit={submit}>
        <input name="name" type="text" value={form.name} onChange={updateField} placeholder="Formula name" required />
        <div className="field-row">
          <select name="occasion" value={form.occasion} onChange={updateField}>
            {["work", "casual", "date", "travel"].map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <select name="style" value={form.style} onChange={updateField}>
            {["minimal", "business", "classic", "athleisure", "preppy"].map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <input name="note" type="text" value={form.note} onChange={updateField} placeholder="Why this formula works" />
        <button className="action-button" type="submit">Add formula</button>
      </form>
      <div className="compact-list">
        {formulas.map((formula) => (
          <div className="compact-item" key={formula.id}>
            <div className="item-header">
              <strong>{formula.name}</strong>
              <button className="text-button" type="button" onClick={() => onDeleteFormula(formula.id)}>Delete</button>
            </div>
            <p>{formula.occasion} - {formula.style} - fit: {formula.bodyFit.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeedbackMemory({ feedback, onClearFeedback }) {
  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Learning loop</p>
          <h2>Feedback memory</h2>
        </div>
        <button className="action-button small" type="button" onClick={onClearFeedback}>Clear</button>
      </div>
      <div className="feedback-list">
        {feedback.length ? (
          feedback.slice().reverse().map((item, index) => (
            <div className="feedback-item" key={`${item.time}-${index}`}>
              <strong>{item.type}</strong>
              <p>{item.formula} - {item.time}</p>
            </div>
          ))
        ) : (
          <div className="feedback-item">
            <strong>No feedback yet</strong>
            <p>User reactions will be stored here and reused in the next recommendation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
