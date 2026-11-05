import { Pencil, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Image } from '@/components/ui/image';
import { formatMKD } from '@/lib/format';

export default function ProductRow({ product, onToggleStock, onEdit, onDelete, busy }) {
  const available = product.is_in_stock !== false;

  return (
    <div className="flex items-center gap-3 py-3">
      {product.image_url ? (
        <Image
          src={product.image_url}
          fittingType="fill"
          className="h-14 w-14 shrink-0 rounded-xl ring-1 ring-slate-100"
        />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">🛍️</div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-semibold text-[#171B3A]">{product.name}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-[12px] font-bold text-[#232866]">{formatMKD(product.price)}</span>
          {product.category_name && (
            <span className="truncate text-[11px] text-slate-400">· {product.category_name}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Switch
          checked={available}
          disabled={busy}
          onCheckedChange={(checked) => onToggleStock(product, checked)}
          aria-label="Достапност"
        />
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-[#232866]"
          aria-label="Уреди"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(product)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-destructive"
          aria-label="Избриши"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}