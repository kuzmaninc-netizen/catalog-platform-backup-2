export const STATUS_META = {
  trial: { label: 'Пробен период', badge: 'border-amber-200 bg-amber-50 text-amber-700' },
  pending: { label: 'Во обработка', badge: 'border-sky-200 bg-sky-50 text-sky-700' },
  active: { label: 'Активна', badge: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  expired: { label: 'Истечена', badge: 'border-rose-200 bg-rose-50 text-rose-700' },
};

export const PLAN_LABELS = { starter: 'Starter', pro: 'Pro' };

export const STATUS_OPTIONS = ['trial', 'pending', 'active', 'expired'];
export const PLAN_OPTIONS = ['starter', 'pro'];

export function statusMeta(status) {
  return STATUS_META[status] || STATUS_META.trial;
}

export function planLabel(plan) {
  return PLAN_LABELS[plan] || PLAN_LABELS.starter;
}

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('mk-MK', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function daysLeft(value) {
  if (!value) return null;
  const end = new Date(`${String(value).slice(0, 10)}T23:59:59`);
  if (Number.isNaN(end.getTime())) return null;
  return Math.ceil((end.getTime() - Date.now()) / 86400000);
}

export function todayPlus(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function expiryText(store) {
  const left = daysLeft(store.subscription_expires_at);
  if (!store.subscription_expires_at) return 'Без закажан датум';
  if (store.subscription_status === 'expired') return `Истече на ${formatDate(store.subscription_expires_at)}`;
  if (left !== null && left < 0) return `Истече на ${formatDate(store.subscription_expires_at)}`;
  if (left === 0) return 'Истекува денес';
  return `Активна до ${formatDate(store.subscription_expires_at)}`;
}