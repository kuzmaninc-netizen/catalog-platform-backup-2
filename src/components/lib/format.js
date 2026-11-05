export function formatMKD(value) {
  const amount = Math.round(Number(value) || 0);
  return `${amount.toLocaleString('de-DE')} ден.`;
}

const cyrillic = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ѓ: 'gj', е: 'e', ж: 'zh', з: 'z',
  ѕ: 'dz', и: 'i', ј: 'j', к: 'k', л: 'l', љ: 'lj', м: 'm', н: 'n', њ: 'nj',
  о: 'o', п: 'p', р: 'r', с: 's', т: 't', ќ: 'kj', у: 'u', ф: 'f', х: 'h',
  ц: 'c', ч: 'ch', џ: 'dj', ш: 'sh',
};

export function slugify(input = '') {
  return String(input)
    .toLowerCase()
    .split('')
    .map((char) => cyrillic[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}