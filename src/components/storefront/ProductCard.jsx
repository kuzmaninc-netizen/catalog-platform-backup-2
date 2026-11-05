import { Plus } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { formatMKD } from '@/lib/format';

export default function ProductCard({ product, inCart, onAdd }) {
  const available = product.is_in_stock !== false;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_8px_20px_-18px_rgba(35,40,102,0.55)] transition">
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            fittingType="fill"
            className={`h-full w-full transition duration-500 group-hover:scale-[1.03] ${
              available ? '' : 'opacity-40 grayscale'
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl">🛍️</div>
        )}

        {!available && (
          <span className="absolute left-2 top-2 rounded-full bg-[#171B3A] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Распродадено
          </span>
        )}

        {inCart > 0 && available && (
          <span className="absolute right-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-extrabold text-[#062B27] shadow">
            {inCart}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-2.5">
        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-[#171B3A]">{product.name}</p>
        {product.category_name && (
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {product.category_name}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2.5">
          <span className="text-[13px] font-extrabold text-[#232866]">{formatMKD(product.price)}</span>
          <button
            type="button"
            disabled={!available}
            onClick={() => onAdd(product)}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-[12px] font-bold transition active:scale-95 ${
              available
                ? 'bg-[#6366F1] text-white hover:bg-[#5356e0]'
                : 'cursor-not-allowed bg-slate-100 text-slate-400'
            }`}
          >
            {available ? (
              <>
                <Plus className="h-3.5 w-3.5" /> Додај
              </>
            ) : (
              'Нема'
            )}
          </button>
        </div>
      </div>
    </article>
  );
}