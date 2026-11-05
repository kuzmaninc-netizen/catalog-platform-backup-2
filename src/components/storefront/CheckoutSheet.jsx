import { useState } from 'react';
import { BadgeCheck, Minus, Plus, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Image } from '@/components/ui/image';
import { formatMKD } from '@/lib/format';
import {
  PAYMENT_METHOD,
  buildOrderMessage,
  buildViberUrl,
  buildWhatsAppUrl,
} from '@/lib/orderMessage';

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[11px] font-medium text-destructive">{error}</span>}
    </label>
  );
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-[#171B3A] outline-none transition placeholder:text-slate-400 focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20';

export default function CheckoutSheet({
  open,
  onOpenChange,
  store,
  items,
  total,
  onChangeQuantity,
  onRemove,
}) {
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null);

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSent(null);
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 3) next.name = 'Внеси име и презиме.';
    if (form.phone.replace(/\D/g, '').length < 7) next.phone = 'Внеси валиден телефонски број.';
    if (form.address.trim().length < 5) next.address = 'Внеси град и адреса за достава.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSend = (channel) => {
    if (items.length === 0) return;
    if (!validate()) return;

    const message = buildOrderMessage({
      storeName: store.business_name,
      items,
      total,
      customer: form,
    });

    if (channel === 'viber') {
      window.location.href = buildViberUrl(store.viber_number || store.whatsapp_number, message);
    } else {
      window.open(
        buildWhatsAppUrl(store.whatsapp_number || store.viber_number, message),
        '_blank',
        'noopener,noreferrer'
      );
    }
    setSent(channel);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[94vh] overflow-y-auto rounded-t-3xl p-0">
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 py-4 pl-5 pr-12 backdrop-blur">
          <SheetTitle className="font-heading text-[16px] font-extrabold tracking-tight text-[#171B3A]">
            Твојата нарачка
          </SheetTitle>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Провери, пополни ги податоците и испрати директно до {store.business_name}
          </p>
        </div>

        <div className="px-5 pb-8 pt-2">
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 py-3">
                {item.product.image_url ? (
                  <Image
                    src={item.product.image_url}
                    fittingType="fill"
                    className="h-12 w-12 shrink-0 rounded-xl ring-1 ring-slate-100"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
                    🛍️
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[#171B3A]">{item.product.name}</p>
                  <p className="text-[11px] text-slate-400">{formatMKD(item.product.price)}</p>
                </div>

                <div className="flex items-center gap-0.5 rounded-xl border border-slate-200 px-1 py-0.5">
                  <button
                    type="button"
                    aria-label="Намали"
                    onClick={() => onChangeQuantity(item.product.id, -1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-5 text-center text-[13px] font-bold text-[#171B3A]">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="Зголеми"
                    onClick={() => onChangeQuantity(item.product.id, 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  aria-label="Избриши"
                  onClick={() => onRemove(item.product.id)}
                  className="text-slate-300 transition hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <span className="text-[12px] font-semibold text-slate-500">Вкупно за плаќање</span>
            <span className="font-heading text-[16px] font-extrabold text-[#232866]">{formatMKD(total)}</span>
          </div>

          <div className="mt-5 space-y-3">
            <Field label="Име и презиме" error={errors.name}>
              <input
                className={inputClass}
                value={form.name}
                onChange={update('name')}
                placeholder="Марија Стојановска"
                autoComplete="name"
              />
            </Field>

            <Field label="Телефон за контакт" error={errors.phone}>
              <input
                className={inputClass}
                value={form.phone}
                onChange={update('phone')}
                placeholder="070 123 456"
                inputMode="tel"
                autoComplete="tel"
              />
            </Field>

            <Field label="Град и адреса за достава" error={errors.address}>
              <textarea
                className={`${inputClass} min-h-[76px] resize-none`}
                value={form.address}
                onChange={update('address')}
                placeholder="Скопје, ул. Партизански одреди 15"
                autoComplete="street-address"
              />
            </Field>
          </div>

          <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-3.5 py-3">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <div>
              <p className="text-[12px] font-bold text-emerald-800">Начин на плаќање</p>
              <p className="text-[12px] text-emerald-700">{PAYMENT_METHOD}</p>
            </div>
          </div>

          <div className="mt-5 space-y-2.5">
            <button
              type="button"
              onClick={() => handleSend('viber')}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7360F2] px-4 py-3.5 text-[14px] font-extrabold text-white shadow-[0_12px_24px_-14px_rgba(115,96,242,0.9)] transition active:scale-[0.99]"
            >
              📲 Испрати преку Viber
            </button>
            {store.whatsapp_number ? (
              <button
                type="button"
                onClick={() => handleSend('whatsapp')}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3.5 text-[14px] font-extrabold text-[#04331a] shadow-[0_12px_24px_-14px_rgba(37,211,102,0.9)] transition active:scale-[0.99]"
              >
                💬 Испрати преку WhatsApp
              </button>
            ) : null}
          </div>

          {sent && (
            <p className="mt-3 rounded-2xl bg-slate-900/5 px-3.5 py-3 text-center text-[11.5px] font-medium text-slate-600">
              Порачката е подготвена. Отвори {sent === 'viber' ? 'Viber' : 'WhatsApp'} и притисни
              „Испрати“ за да стигне до продавницата.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}