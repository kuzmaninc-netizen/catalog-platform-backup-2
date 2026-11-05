import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { catalogApi } from '@/api/catalog';
import { PLAN_LABELS, PLAN_OPTIONS } from '@/lib/subscription';

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13.5px] text-[#171B3A] outline-none transition placeholder:text-slate-400 focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20';

export default function ContactRequestForm({ store }) {
  const [form, setForm] = useState({
    phone: store.whatsapp_number || '',
    plan: store.subscription_plan || 'starter',
    message: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.phone.trim()) {
      setError('Внеси телефон за контакт.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await catalogApi('createSubscriptionRequest', { ...form });
      setDone(true);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-[12.5px] font-medium text-emerald-800">
        Барањето е примено. Ќе те контактираме на {form.phone} за да ја договориме уплатата.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2.5 rounded-2xl bg-slate-50 p-3.5">
      <label className="block">
        <span className="mb-1.5 block text-[11.5px] font-semibold text-slate-600">Телефон за контакт</span>
        <input
          className={inputClass}
          value={form.phone}
          onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          placeholder="070 123 456"
          inputMode="tel"
        />
      </label>

      <div>
        <span className="mb-1.5 block text-[11.5px] font-semibold text-slate-600">План</span>
        <div className="grid grid-cols-2 gap-2">
          {PLAN_OPTIONS.map((plan) => (
            <button
              key={plan}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, plan }))}
              className={`rounded-xl border px-3 py-2 text-[12.5px] font-bold transition ${
                form.plan === plan
                  ? 'border-[#6366F1] bg-white text-[#6366F1]'
                  : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              {PLAN_LABELS[plan]}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[11.5px] font-semibold text-slate-600">Порака (опционално)</span>
        <textarea
          className={`${inputClass} min-h-[64px] resize-none`}
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          placeholder="Кога да те контактираме, дали ти треба фактура…"
        />
      </label>

      {error && <p className="text-[11.5px] font-medium text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#232866] px-4 py-2.5 text-[12.5px] font-bold text-white transition active:scale-[0.99] disabled:opacity-60"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Испрати барање
      </button>
    </form>
  );
}