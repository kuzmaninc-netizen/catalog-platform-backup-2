import { Facebook, Instagram, MapPin, Plus } from 'lucide-react';
import { Image } from '@/components/ui/image';

// Sample data — used only to illustrate a storefront on the landing page.
const sampleProducts = [
  {
    name: 'Чоколадна торта 20см',
    price: '1.800 ден.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=320&q=70',
  },
  {
    name: 'Роденденска торта',
    price: '2.400 ден.',
    image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=320&q=70',
  },
  {
    name: 'Капкејци со шлаг',
    price: '180 ден.',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=320&q=70',
  },
  {
    name: 'Макарони 6 пар.',
    price: '450 ден.',
    image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=320&q=70',
  },
];

export default function MiniStorePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-b from-indigo-200/40 to-teal-200/40 blur-2xl" />
      <div className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-[0_30px_60px_-25px_rgba(35,40,102,0.45)]">
        <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[10px] font-semibold text-slate-400">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span className="h-1.5 w-3 rounded-sm bg-slate-300" />
          </span>
        </div>

        <div className="px-5 pt-3">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl brand-gradient text-xl font-bold text-white">
              T
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-[15px] font-extrabold leading-tight text-[#232866]">
                Terti &amp; Slatki
              </p>
              <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                <MapPin className="h-2.5 w-2.5" /> Скопје
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-[#6366F1]">
              <Instagram className="h-2.5 w-2.5" /> @terti.skopje
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
              <Facebook className="h-2.5 w-2.5" /> /tertislatki
            </span>
          </div>

          <p className="mt-2.5 text-[11px] leading-relaxed text-slate-500">
            Домашни торти и колачи по нарачка. Достава во Скопје во рок од 24ч.
          </p>
        </div>

        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
          <span className="whitespace-nowrap rounded-full bg-[#232866] px-3 py-1 text-[10px] font-semibold text-white">
            Сите
          </span>
          <span className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1 text-[10px] font-semibold text-slate-500">
            Торти
          </span>
          <span className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1 text-[10px] font-semibold text-slate-500">
            Колачи
          </span>
          <span className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1 text-[10px] font-semibold text-slate-500">
            Подароци
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5 px-5 pb-4">
          {sampleProducts.map((p) => (
            <div key={p.name} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <Image src={p.image} fittingType="fill" className="aspect-square w-full object-cover" />
              <div className="p-2">
                <p className="truncate text-[10px] font-semibold text-slate-600">{p.name}</p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-[10px] font-extrabold text-[#232866]">{p.price}</p>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6366F1] text-white">
                    <Plus className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-5 mb-4 flex items-center justify-between rounded-2xl bg-[#0F1424] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2DD4BF] text-[10px] font-bold text-[#062B27]">
              2
            </span>
            <span className="text-[10px] font-semibold text-white/70">Вкупно</span>
          </div>
          <span className="text-[11px] font-bold text-white">1.980 ден. ›</span>
        </div>
      </div>
    </div>
  );
}