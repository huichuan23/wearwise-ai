export function splitInput(value) {
  return String(value || "")
    .toLowerCase()
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function uniqueTags(tags) {
  return [...new Set(tags.filter(Boolean))];
}

export function hasAny(text, words) {
  return words.some((word) => text.includes(word));
}
