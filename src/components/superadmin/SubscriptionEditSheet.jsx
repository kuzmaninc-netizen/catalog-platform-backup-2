import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PLAN_LABELS, PLAN_OPTIONS, STATUS_META, STATUS_OPTIONS, formatDate } from '@/lib/subscription';

export default function SubscriptionEditSheet({ merchant, open, onOpenChange, onSave, busy }) {
  const [form, setForm] = useState({ status: 'trial', plan: 'starter', expires: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !merchant) return;
    setError('');
    setForm({
      status: merchant.subscription_status || 'trial',
      plan: merchant.subscription_plan || 'starter',
      expires: String(merchant.subscription_expires_at || '').slice(0, 10),
    });
  }, [open, merchant]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (form.expires && !/^\d{4}-\d{2}-\d{2}$/.test(form.expires)) {
      setError('Внеси валиден датум.');
      return;
    }
    onSave({
      subscription_status: form.status,
      subscription_plan: form.plan,
      subscription_expires_at: form.expires,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl p-0">
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 py-4 pl-5 pr-12 backdrop-blur">
          <SheetTitle className="font-heading text-[16px] font-extrabold tracking-tight text-[#171B3A]">
            Претплата · {merchant?.business_name || ''}
          </SheetTitle>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 px-5 pb-8 pt-4">
          <div>
            <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">Статус</span>
            <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}>
              <SelectTrigger className="h-[46px] rounded-xl border-slate-200 text-[13.5px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {STATUS_META[status].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">План</span>
            <Select value={form.plan} onValueChange={(value) => setForm((prev) => ({ ...prev, plan: value }))}>
              <SelectTrigger className="h-[46px] rounded-xl border-slate-200 text-[13.5px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLAN_OPTIONS.map((plan) => (
                  <SelectItem key={plan} value={plan}>
                    {PLAN_LABELS[plan]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">Активна до</span>
            <input
              type="date"
              value={form.expires}
              onChange={(event) => setForm((prev) => ({ ...prev, expires: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-[#171B3A] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
            />
            <span className="mt-1 block text-[11px] text-slate-400">
              Последен платен ден. По овој датум каталогот автоматски се затвора.
            </span>
          </label>

          {merchant?.subscription_expires_at ? (
            <p className="text-[11.5px] text-slate-400">
              Моментално: {formatDate(merchant.subscription_expires_at)}
            </p>
          ) : null}

          {error && <p className="text-[11.5px] font-medium text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6366F1] px-4 py-3.5 text-[14px] font-extrabold text-white transition active:scale-[0.99] disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Зачувај
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
}