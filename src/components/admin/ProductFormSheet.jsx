import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import ImagePicker from '@/components/admin/ImagePicker';

const NEW_CATEGORY = '__new';

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-[#171B3A] outline-none transition placeholder:text-slate-400 focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20';

export default function ProductFormSheet({ open, onOpenChange, product, categories, onSave, busy }) {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image_url: '',
    is_in_stock: true,
  });
  const [categoryName, setCategoryName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setNewCategory('');
    setCategoryName(product?.category_name || '');
    setForm({
      name: product?.name || '',
      price: product?.price ? String(product.price) : '',
      description: product?.description || '',
      image_url: product?.image_url || '',
      is_in_stock: product?.is_in_stock !== false,
    });
  }, [open, product]);

  const categoryOptions = useMemo(() => {
    const names = categories.map((category) => category.name).filter(Boolean);
    if (product?.category_name && !names.includes(product.category_name)) names.push(product.category_name);
    return [...new Set(names)];
  }, [categories, product]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Внеси име на производот.';
    if (!form.price || Number(form.price) <= 0) next.price = 'Внеси цена во денари.';
    if (categoryName === NEW_CATEGORY && !newCategory.trim()) next.category = 'Внеси име на новата категорија.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSave({
      name: form.name.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      image_url: form.image_url,
      is_in_stock: form.is_in_stock,
      category_name: categoryName === NEW_CATEGORY ? newCategory.trim() : categoryName,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[94vh] overflow-y-auto rounded-t-3xl p-0">
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 py-4 pl-5 pr-12 backdrop-blur">
          <SheetTitle className="font-heading text-[16px] font-extrabold tracking-tight text-[#171B3A]">
            {product ? 'Уреди производ' : 'Нов производ'}
          </SheetTitle>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 px-5 pb-8 pt-4">
          <div className="flex items-center gap-4">
            <ImagePicker
              value={form.image_url}
              onChange={(url) => setForm((prev) => ({ ...prev, image_url: url }))}
              className="h-24 w-24"
            />
            <p className="text-[11.5px] leading-relaxed text-slate-500">
              Сликата автоматски се намалува на 800×800 и се зачувува како WebP.
            </p>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">Име на производот</span>
            <input
              className={inputClass}
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Храна за кучиња 3кг"
            />
            {errors.name && <span className="mt-1 block text-[11px] font-medium text-destructive">{errors.name}</span>}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">Цена (МКД)</span>
              <input
                className={inputClass}
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                placeholder="0"
                inputMode="decimal"
              />
              {errors.price && (
                <span className="mt-1 block text-[11px] font-medium text-destructive">{errors.price}</span>
              )}
            </label>

            <div>
              <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">Категорија</span>
              <Select value={categoryName} onValueChange={setCategoryName}>
                <SelectTrigger className="h-[46px] rounded-xl border-slate-200 text-[13.5px]">
                  <SelectValue placeholder="Избери" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                  <SelectItem value={NEW_CATEGORY}>＋ Нова категорија</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {categoryName === NEW_CATEGORY && (
            <div>
              <input
                className={inputClass}
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                placeholder="Име на новата категорија"
              />
              {errors.category && (
                <span className="mt-1 block text-[11px] font-medium text-destructive">{errors.category}</span>
              )}
            </div>
          )}

          <label className="block">
            <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">Опис (опционално)</span>
            <textarea
              className={`${inputClass} min-h-[76px] resize-none`}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Краток опис, големина, боја…"
            />
          </label>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-3.5 py-3">
            <div>
              <p className="text-[12.5px] font-semibold text-[#171B3A]">Достапно на залиха</p>
              <p className="text-[11px] text-slate-400">Исклучи ако производот е распродаден.</p>
            </div>
            <Switch
              checked={form.is_in_stock}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_in_stock: checked }))}
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6366F1] px-4 py-3.5 text-[14px] font-extrabold text-white shadow-[0_14px_28px_-16px_rgba(99,102,241,0.9)] transition active:scale-[0.99] disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {product ? 'Зачувај промени' : 'Додај производ'}
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
}