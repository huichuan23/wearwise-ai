"use client";

import { buildAmazonUrl, buildReasonBlocks } from "@/lib/recommendation/engine";

export default function RecommendationCard({ item, profile, featured, onFeedback }) {
  const match = Math.max(0, Math.min(100, Math.round(item.score)));
  const productIds = item.products.map((product) => product.id);

  return (
    <article className={`outfit-card ${featured ? "featured" : ""}`}>
      <div className="outfit-cover">
        <div className="outfit-image" style={{ backgroundImage: `url('${item.formula.image}')` }} />
        <div className="outfit-copy">
          <h3>{item.formula.name}</h3>
          <div className="outfit-meta">
            <span className="tag">Est. ${item.total}</span>
            <span className="tag">{match}/100 match</span>
            <span className="tag">{item.formula.occasion}</span>
            <span className="tag">{item.formula.style}</span>
          </div>
          <div className="reason-grid">
            {buildReasonBlocks(item, profile).map((block) => (
              <p key={block.title}>
                <strong>{block.title}</strong>
                {block.body}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="product-row">
        {item.products.slice(0, 4).map((product) => (
          <div className="product-card" key={product.id}>
            <strong>{product.name}</strong>
            <span>{product.category} - est. ${product.price}</span>
            <span>ASIN {product.asin}</span>
          </div>
        ))}
      </div>

      <div className="outfit-actions">
        <a className="amazon-link" href={buildAmazonUrl(item.products)} target="_blank" rel="noreferrer">
          View on Amazon
        </a>
        {["like", "not my style", "too expensive"].map((type) => (
          <button key={type} className="action-button" type="button" onClick={() => onFeedback({ type, formula: item.formula.name, style: item.formula.style, productIds })}>
            {type === "like" ? "Like" : type === "not my style" ? "Not my style" : "Too expensive"}
          </button>
        ))}
      </div>
    </article>
  );
}
