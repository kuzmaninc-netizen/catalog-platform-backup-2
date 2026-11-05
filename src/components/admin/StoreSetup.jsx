import { useMemo, useState } from 'react';
import { ArrowRight, Loader2, Store } from 'lucide-react';
import Brand from '@/components/Brand';
import ImagePicker from '@/components/admin/ImagePicker';
import { catalogApi } from '@/api/catalog';
import { slugify } from '@/lib/format';

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-[#171B3A] outline-none transition placeholder:text-slate-400 focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20';

function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>}
      {error && <span className="mt-1 block text-[11px] font-medium text-destructive">{error}</span>}
    </label>
  );
}

export default function StoreSetup({
  onCreated,
  onDetails,
  defer = false,
  stepLabel = '',
  initial = {},
  lockContacts = false,
}) {
  const [form, setForm] = useState({
    business_name: '',
    slug: '',
    whatsapp_number: initial.whatsapp_number || '',
    viber_number: initial.viber_number || '',
    facebook_url: initial.facebook_url || '',
    city: 'Скопје',
    bio_text: '',
    instagram: '',
    logo_url: '',
  });
  const [slugEdited, setSlugEdited] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const slugPreview = useMemo(
    () => slugify(slugEdited ? form.slug : form.business_name) || 'tvoja-prodavnica',
    [form.business_name, form.slug, slugEdited]
  );

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSlug = (event) => {
    setSlugEdited(true);
    setForm((prev) => ({ ...prev, slug: event.target.value }));
    setErrors((prev) => ({ ...prev, slug: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const next = {};
    if (!form.business_name.trim()) next.business_name = 'Внеси име на бизнисот.';
    if (!form.city.trim()) next.city = 'Внеси град.';
    if (!lockContacts && !form.whatsapp_number.trim() && !form.viber_number.trim()) {
      next.whatsapp_number = 'Внеси барем еден број за нарачки.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (defer) {
      onDetails?.({ ...form, slug: slugPreview });
      return;
    }

    setBusy(true);
    try {
      const data = await catalogApi('createStore', {
        store: { ...form, slug: slugPreview },
      });
      onCreated(data.store);
    } catch (error) {
      setErrors({ business_name: error.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-5 py-8">
      <div className="mx-auto max-w-md">
        <Brand size="md" />
        {stepLabel && (
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{stepLabel}</p>
        )}
        <h1
          className={`${
            stepLabel ? 'mt-1.5' : 'mt-6'
          } font-heading text-2xl font-extrabold tracking-tight text-[#171B3A]`}
        >
          Детали за каталогот
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
          Името, линкот и изгледот на продавницата. Првите 7 дена се бесплатни.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-3.5 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_-32px_rgba(35,40,102,0.6)]"
        >
          <div className="flex items-center gap-4">
            <ImagePicker
              value={form.logo_url}
              onChange={(url) => setForm((prev) => ({ ...prev, logo_url: url }))}
              label="Лого"
            />
            <div className="text-[12px] leading-relaxed text-slate-500">
              <p className="font-semibold text-[#171B3A]">Лого или слика на бизнисот</p>
              <p className="mt-0.5">Опционално. Се намалува автоматски на 800×800.</p>
            </div>
          </div>

          <Field label="Име на бизнисот" error={errors.business_name}>
            <input
              className={inputClass}
              value={form.business_name}
              onChange={update('business_name')}
              placeholder="Skopje Paws"
            />
          </Field>

          <Field
            label="Линк на продавницата"
            hint="Можеш да го смениш. Ако е зафатен, додаваме број."
            error={errors.slug}
          >
            <div className="flex items-center rounded-xl border border-slate-200 bg-white pl-3 focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]/20">
              <span className="shrink-0 text-[13px] font-semibold text-slate-400">catalog.mk/</span>
              <input
                className="w-full bg-transparent py-3 pl-1 pr-3 text-[14px] font-bold text-[#232866] outline-none"
                value={slugPreview}
                onChange={handleSlug}
                placeholder="tvoja-prodavnica"
                spellCheck={false}
              />
            </div>
          </Field>

          {lockContacts ? (
            <div className="rounded-xl bg-slate-50 px-3.5 py-3 text-[12px] text-slate-600">
              <p className="font-semibold text-[#171B3A]">Контакт за нарачки</p>
              <p className="mt-0.5">
                Viber: {form.viber_number || '—'}
                {form.whatsapp_number ? ` · WhatsApp: ${form.whatsapp_number}` : ' · без WhatsApp'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Field label="WhatsApp број" error={errors.whatsapp_number} hint="Опционално">
                <input
                  className={inputClass}
                  value={form.whatsapp_number}
                  onChange={update('whatsapp_number')}
                  placeholder="070 123 456"
                  inputMode="tel"
                />
              </Field>
              <Field label="Viber број" hint="За нарачки">
                <input
                  className={inputClass}
                  value={form.viber_number}
                  onChange={update('viber_number')}
                  placeholder="070 123 456"
                  inputMode="tel"
                />
              </Field>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Град" error={errors.city}>
              <input className={inputClass} value={form.city} onChange={update('city')} placeholder="Скопје" />
            </Field>
            <Field label="Instagram">
              <input
                className={inputClass}
                value={form.instagram}
                onChange={update('instagram')}
                placeholder="@skopjepaws"
              />
            </Field>
          </div>

          <Field label="Кратко претставување">
            <textarea
              className={`${inputClass} min-h-[80px] resize-none`}
              value={form.bio_text}
              onChange={update('bio_text')}
              placeholder="Храна и играчки за миленици. Достава во Скопје во рок од 24ч."
            />
          </Field>

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6366F1] px-4 py-3.5 text-[14px] font-extrabold text-white shadow-[0_14px_28px_-16px_rgba(99,102,241,0.9)] transition active:scale-[0.99] disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : defer ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <Store className="h-4 w-4" />
            )}
            {defer ? 'Продолжи кон пакетите' : 'Создај каталог'}
          </button>
        </form>
      </div>
    </div>
  );
}