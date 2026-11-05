import { formatMKD } from './format';

const PAYMENT_METHOD = 'Во готово при преземање (Карго)';

export function normalizePhone(raw = '') {
  let digits = String(raw).replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = `389${digits.slice(1)}`;
  if (!digits.startsWith('389') && digits.length === 8) digits = `389${digits}`;
  return digits;
}

export function buildOrderMessage({ storeName, items, total, customer }) {
  const lines = [`Здраво ${storeName}! 👋`, 'Сакам да нарачам:', ''];

  items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name} × ${item.quantity} = ${formatMKD(item.price * item.quantity)}`);
  });

  lines.push('', `Вкупно: ${formatMKD(total)}`, '');
  lines.push(`Име: ${customer.name}`);
  lines.push(`Телефон: ${customer.phone}`);
  lines.push(`Адреса: ${customer.address}`);
  lines.push(`Плаќање: ${PAYMENT_METHOD}`);

  return lines.join('\n');
}

export function buildWhatsAppUrl(number, message) {
  return `https://wa.me/${normalizePhone(number)}?text=${encodeURIComponent(message)}`;
}

export function buildViberUrl(number, message) {
  return `viber://chat?number=%2B${normalizePhone(number)}&text=${encodeURIComponent(message)}`;
}

export { PAYMENT_METHOD };