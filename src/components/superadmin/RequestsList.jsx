import { Check } from 'lucide-react';
import { PLAN_LABELS } from '@/lib/subscription';
import { formatDate } from '@/lib/subscription';

export default function RequestsList({ requests, onResolve, busy }) {
  if (requests.length === 0) return null;

  return (
    <section className="space-y-2">
      <h2 className="px-1 font-heading text-[13px] font-extrabold uppercase tracking-wide text-slate-400">
        Нови барања ({requests.length})
      </h2>
      {requests.map((request) => (
        <div key={request.id} className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-heading text-[13.5px] font-extrabold text-[#171B3A]">
                {request.business_name}
              </p>
              <p className="mt-0.5 text-[11.5px] text-slate-600">
                {request.phone} · {PLAN_LABELS[request.plan_requested] || PLAN_LABELS.starter}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">{formatDate(request.created_date)}</p>
            </div>
            <button
              type="button"
              onClick={() => onResolve(request)}
              disabled={busy}
              className="flex shrink-0 items-center gap-1 rounded-xl bg-[#232866] px-2.5 py-2 text-[11px] font-bold text-white transition active:scale-95 disabled:opacity-60"
            >
              <Check className="h-3.5 w-3.5" /> Решено
            </button>
          </div>
          {request.message ? (
            <p className="mt-2 rounded-xl bg-white/70 px-2.5 py-2 text-[11.5px] leading-relaxed text-slate-600">
              {request.message}
            </p>
          ) : null}
        </div>
      ))}
    </section>
  );
}