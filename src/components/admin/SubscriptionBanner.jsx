import { buildViberUrl, buildWhatsAppUrl } from '@/lib/orderMessage';
import { PLATFORM } from '@/config/platform';
import { daysLeft, expiryText, planLabel, statusMeta } from '@/lib/subscription';

export default function SubscriptionBanner({ store }) {
  const meta = statusMeta(store.subscription_status);
  const left = daysLeft(store.subscription_expires_at);
  const isTrial = store.subscription_status === 'trial';
  const isExpired = store.subscription_status === 'expired';
  const message = `Здраво! Сакам да ја активирам претплатата за catalog.mk/${store.slug} (${store.business_name}).`;
  const whatsappUrl = buildWhatsAppUrl(PLATFORM.adminWhatsapp, message);
  const viberUrl = buildViberUrl(PLATFORM.adminViber, message);

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-[0_14px_34px_-30px_rgba(35,40,102,0.6)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Претплата</p>
          <p className="mt-0.5 font-heading text-[15px] font-extrabold text-[#171B3A]">
            План {planLabel(store.subscription_plan)}
          </p>
          <p className="mt-0.5 text-[12px] text-slate-500">{expiryText(store)}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${meta.badge}`}>
          {meta.label}
        </span>
      </div>

      {isTrial && (
        <p className="mt-3 rounded-2xl bg-amber-50 px-3 py-2 text-[12px] font-medium text-amber-800">
          {left !== null && left >= 0
            ? `Пробен период — уште ${left} ${left === 1 ? 'ден' : 'дена'}. По истекот контактирај нè за да го активираш пакетот.`
            : 'Пробниот период истекува денес. Контактирај нè за да го активираш пакетот.'}
        </p>
      )}

      {isExpired && (
        <p className="mt-3 rounded-2xl bg-rose-50 px-3 py-2 text-[12px] font-medium text-rose-700">
          Каталогот е привремено скриен за клиентите. Контактирај нè за да го вратиш.
        </p>
      )}

      <div className="mt-3.5 space-y-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-bold text-emerald-800 transition active:scale-[0.99]"
        >
          💬 Контактирај нè на WhatsApp
        </a>
        <a
          href={viberUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-[13px] font-bold text-violet-800 transition active:scale-[0.99]"
        >
          📲 Контактирај нè на Viber
        </a>
      </div>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-400">
        Активирањето и продолжувањето на претплатата ги договараме директно во порака.
      </p>
    </section>
  );
}