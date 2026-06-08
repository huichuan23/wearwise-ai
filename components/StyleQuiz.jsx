"use client";

import { splitInput } from "@/lib/utils/tags";

export default function StyleQuiz({ formState, onFormChange, segmentState, onSegmentChange, onGenerate, onReset }) {
  function updateField(event) {
    const { name, value, files } = event.target;
    onFormChange({
      ...formState,
      [name]: files ? files[0]?.name || "" : value,
    });
  }

  function submit(event) {
    event.preventDefault();
    onGenerate({
      ...formState,
      occasion: segmentState.occasion,
      style: segmentState.style,
      budget: Number(segmentState.budget),
      colors: splitInput(formState.colors),
      avoid: splitInput(formState.avoid),
      photoName: formState.photo || "",
    });
  }

  return (
    <section className="panel quiz-panel" aria-labelledby="quiz-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Style quiz</p>
          <h2 id="quiz-title">Build a shopper profile</h2>
        </div>
        <button className="icon-button" type="button" title="Reset quiz" aria-label="Reset quiz" onClick={onReset}>
          R
        </button>
      </div>

      <form className="quiz-form" onSubmit={submit}>
        <div className="field-row">
          <SelectField label="Height" name="height" value={formState.height} onChange={updateField} options={["petite", "average", "tall"]} />
          <SelectField label="Body type" name="bodyType" value={formState.bodyType} onChange={updateField} options={["pear", "apple", "rectangle", "hourglass", "plus"]} />
        </div>

        <div className="field-row">
          <SelectField label="Size range" name="sizeRange" value={formState.sizeRange} onChange={updateField} options={["xs-s", "m", "l-xl", "plus"]} />
          <SelectField label="Fit preference" name="fitPreference" value={formState.fitPreference} onChange={updateField} options={["tailored", "relaxed", "oversized"]} />
        </div>

        <SegmentedControl label="Occasion" group="occasion" values={["work", "casual", "date", "travel"]} state={segmentState} onChange={onSegmentChange} />
        <SegmentedControl label="Style direction" group="style" values={["minimal", "business", "classic", "athleisure", "preppy"]} state={segmentState} onChange={onSegmentChange} wrap />
        <SegmentedControl label="Budget per outfit" group="budget" values={["75", "150", "250"]} labels={["Under $75", "$75-$150", "$150-$250"]} state={segmentState} onChange={onSegmentChange} />

        <div className="field-row">
          <SelectField label="Work dress code" name="dressCode" value={formState.dressCode} onChange={updateField} options={["casual", "business casual", "formal"]} />
          <SelectField label="Climate" name="climate" value={formState.climate} onChange={updateField} options={["warm", "mixed", "cold"]} />
        </div>

        <div className="field-row">
          <SelectField label="Goal" name="goal" value={formState.goal} onChange={updateField} options={["look taller", "look polished", "feel comfortable", "balance proportions"]} />
          <SelectField label="Shoes" name="shoePreference" value={formState.shoePreference} onChange={updateField} options={["flats only", "low heel", "any"]} />
        </div>

        <label>
          Favorite colors
          <input name="colors" type="text" value={formState.colors} onChange={updateField} placeholder="Example: black, navy, white" />
        </label>

        <label>
          Avoid
          <input name="avoid" type="text" value={formState.avoid} onChange={updateField} placeholder="Example: tight tops, beige, heels" />
        </label>

        <label>
          Optional photo check
          <input name="photo" type="file" accept="image/*" onChange={updateField} />
        </label>

        <button className="primary-button" type="submit">
          Generate 3 outfits
        </button>
      </form>
    </section>
  );
}

function SelectField({ label, name, value, options, onChange }) {
  return (
    <label>
      {label}
      <select name={name} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SegmentedControl({ label, group, values, labels = values, state, onChange, wrap = false }) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <div className={`segmented ${wrap ? "wrap" : ""}`}>
        {values.map((value, index) => (
          <button key={value} type="button" className={String(state[group]) === value ? "active" : ""} onClick={() => onChange(group, value)}>
            {labels[index]}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
