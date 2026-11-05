import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import ImagePicker from '@/components/admin/ImagePicker';

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-[#171B3A] outline-none transition placeholder:text-slate-400 focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20';

export default function StoreSettingsSheet({ open, onOpenChange, store, onSave, busy }) {
  const [form, setForm] = useState(store);

  useEffect(() => {
    if (open) setForm(store);
  }, [open, store]);

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      business_name: form.business_name,
      whatsapp_number: form.whatsapp_number,
      viber_number: form.viber_number,
      city: form.city,
      instagram: form.instagram,
      facebook_url: form.facebook_url,
      bio_text: form.bio_text,
      logo_url: form.logo_url,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[94vh] overflow-y-auto rounded-t-3xl p-0">
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 py-4 pl-5 pr-12 backdrop-blur">
          <SheetTitle className="font-heading text-[16px] font-extrabold tracking-tight text-[#171B3A]">
            Податоци за продавницата
          </SheetTitle>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 px-5 pb-8 pt-4">
          <ImagePicker
            value={form.logo_url}
            onChange={(url) => setForm((prev) => ({ ...prev, logo_url: url }))}
            label="Лого"
          />

          <label className="block">
            <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">Име на бизнисот</span>
            <input className={inputClass} value={form.business_name} onChange={update('business_name')} />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">WhatsApp</span>
              <input
                className={inputClass}
                value={form.whatsapp_number}
                onChange={update('whatsapp_number')}
                inputMode="tel"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">Viber</span>
              <input
                className={inputClass}
                value={form.viber_number}
                onChange={update('viber_number')}
                inputMode="tel"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">Град</span>
              <input className={inputClass} value={form.city} onChange={update('city')} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">Instagram</span>
              <input className={inputClass} value={form.instagram} onChange={update('instagram')} />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">Facebook страница</span>
            <input
              className={inputClass}
              value={form.facebook_url || ''}
              onChange={update('facebook_url')}
              placeholder="facebook.com/tertislatki"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">Кратко претставување</span>
            <textarea
              className={`${inputClass} min-h-[80px] resize-none`}
              value={form.bio_text}
              onChange={update('bio_text')}
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#232866] px-4 py-3.5 text-[14px] font-extrabold text-white transition active:scale-[0.99] disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Зачувај
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
}