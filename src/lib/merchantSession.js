const KEY = 'catalogmk.merchant';

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null');
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

export function storeUrl(slug) {
  if (typeof window === 'undefined') return slug;
  return `${window.location.origin}/${slug}`;
}

export function prettyUrl(slug) {
  return `catalog.mk/${slug}`;
}