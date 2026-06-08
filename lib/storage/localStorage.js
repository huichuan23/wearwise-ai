export function loadList(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const saved = JSON.parse(window.localStorage.getItem(key) || "null");
    if (Array.isArray(saved)) return saved;
  } catch (error) {
    console.warn(`Could not load ${key}`, error);
  }

  return fallback;
}

export function saveList(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadObject(key, fallback = null) {
  if (typeof window === "undefined") return fallback;

  try {
    return JSON.parse(window.localStorage.getItem(key) || "null") || fallback;
  } catch (error) {
    console.warn(`Could not load ${key}`, error);
    return fallback;
  }
}

export function saveObject(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
