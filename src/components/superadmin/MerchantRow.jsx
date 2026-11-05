import { ExternalLink, Pencil, Zap } from 'lucide-react';
import { expiryText, planLabel, statusMeta } from '@/lib/subscription';
import { prettyUrl } from '@/lib/merchantSession';

function registeredDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('mk-MK', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function MerchantRow({ merchant, onEdit, onActivate, busy }) {
  const meta = statusMeta(merchant.subscription_status);
  const contacts = [
    merchant.whatsapp_number && `WhatsApp ${merchant.whatsapp_number}`,
    merchant.viber_number && `Viber ${merchant.viber_number}`,
  ].filter(Boolean);

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-heading text-[14px] font-extrabold text-[#171B3A]">
            {merchant.business_name}
          </p>
          <a
            href={`/${merchant.slug}`}
            target="_blank"
            rel="noreferrer"
            className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#6366F1]"
          >
            {prettyUrl(merchant.slug)} <ExternalLink className="h-3 w-3" />
          </a>
          <p className="mt-1 text-[11.5px] text-slate-500">{contacts.join(' · ') || 'Без контакт'}</p>
          <p className="text-[11px] text-slate-400">
            Регистриран: {registeredDate(merchant.created_date)}
            {merchant.city ? ` · ${merchant.city}` : ''}
          </p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10.5px] font-bold ${meta.badge}`}>
          {meta.label}
        </span>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-slate-500">
        <span>
          План: <b className="text-[#232866]">{planLabel(merchant.subscription_plan)}</b>
        </span>
        <span>{expiryText(merchant)}</span>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => onActivate(merchant)}
          disabled={busy}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-[12px] font-bold text-white transition active:scale-[0.99] disabled:opacity-60"
        >
          <Zap className="h-3.5 w-3.5" /> Активирај претплата
        </button>
        <button
          type="button"
          onClick={() => onEdit(merchant)}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-[12px] font-bold text-[#232866] transition hover:border-primary/40"
        >
          <Pencil className="h-3.5 w-3.5" /> Уреди
        </button>
      </div>
    </div>
  );
}