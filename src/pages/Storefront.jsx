import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, MessageCircle, Instagram, Facebook, Tag } from 'lucide-react';
import { catalogApi } from '@/api/catalog';

export default function Storefront() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function loadStore() {
      try {
        setLoading(true);
        // Повикуваме API за земање на продавницата преку slug
        const result = await catalogApi('getStoreBySlug', { slug });
        setData(result);
      } catch (err) {
        setError('Каталогот не е пронајден или е неактивен.');
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadStore();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#6366F1]" />
      </div>
    );
  }

  if (error || !data?.store) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <h1 className="font-heading text-lg font-extrabold text-[#171B3A]">Каталогот не постои</h1>
        <p className="mt-2 text-[13px] text-slate-500">Проверете дали линкот е правилен или побарајте го бизнисот.</p>
      </div>
    );
  }

  const { store, products = [], categories = [] } = data;

  // Филтрирање на производи според категорија
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.categoryId === selectedCategory || p.category === selectedCategory);

  // Форматирање на Viber линк со готова порака за конкретниот производ
  const getViberLink = (product) => {
    const viberNumber = store?.viberNumber || store?.phone || '';
    const cleanNumber = viberNumber.replace(/[^0-9+]/g, '');
    
    const message = `Здраво! Го разгледувам вашиот каталог на catalog.mk и сакам да го нарачам овој производ:\n\n📌 ${product.name}\n💰 Цена: ${product.price} ден.`;
    
    return `viber://chat?number=${encodeURIComponent(cleanNumber)}&draft=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* HEADER / БИЗНИС ИНФОРМАЦИИ */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-3xl px-4 py-6 text-center">
          {store?.logoUrl ? (
            <img
              src={store.logoUrl}
              alt={store.business_name}
              className="mx-auto h-20 w-20 rounded-full border border-slate-100 object-cover shadow-sm"
            />
          ) : (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 font-heading text-2xl font-bold text-[#6366F1]">
              {store?.business_name?.charAt(0) || 'C'}
            </div>
          )}

          <h1 className="mt-3 font-heading text-2xl font-extrabold text-[#171B3A]">
            {store?.business_name}
          </h1>
          
          {store?.description && (
            <p className="mt-1 text-[13.5px] leading-relaxed text-slate-500">
              {store.description}
            </p>
          )}

          {/* Социјални профили */}
          <div className="mt-3 flex items-center justify-center gap-3">
            {store?.instagramHandle && (
              <a
                href={`https://instagram.com/${store.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <Instagram className="h-3.5 w-3.5 text-pink-600" />
                @{store.instagramHandle.replace('@', '')}
              </a>
            )}
            {store?.facebookUrl && (
              <a
                href={store.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <Facebook className="h-3.5 w-3.5 text-blue-600" />
                Facebook
              </a>
            )}
          </div>
        </div>

        {/* Филтер по категории */}
        {categories.length > 0 && (
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto border-t border-slate-100 px-4 py-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 rounded-xl px-3.5 py-1.5 text-[12.5px] font-bold transition ${
                selectedCategory === 'all'
                  ? 'bg-[#232866] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Сите производи
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id || cat}
                onClick={() => setSelectedCategory(cat.id || cat)}
                className={`shrink-0 rounded-xl px-3.5 py-1.5 text-[12.5px] font-bold transition ${
                  selectedCategory === (cat.id || cat)
                    ? 'bg-[#232866] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name || cat}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ЛИСТА НА ПРОИЗВОДИ */}
      <main className="mx-auto max-w-3xl px-4 py-6">
        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Tag className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-2 text-[14px]">Сè уште нема производи во овој каталог.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredProducts.map((product) => {
              const isInStock = product.is_in_stock !== false;
              return (
                <div
                  key={product.id}
                  className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]"
                >
                  <div>
                    {/* Слика на производот */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className={`h-full w-full object-cover transition duration-300 ${
                            !isInStock ? 'grayscale opacity-60' : ''
                          }`}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                          <Tag className="h-10 w-10" />
                        </div>
                      )}

                      {/* Беџ: Распродадено */}
                      {!isInStock && (
                        <span className="absolute right-3 top-3 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
                          Распродадено
                        </span>
                      )}
                    </div>

                    {/* Информации за производот */}
                    <h3 className="mt-3 font-heading text-[16px] font-bold text-[#171B3A]">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-slate-500">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <div className="flex items-baseline justify-between">
                      <span className="font-heading text-[18px] font-extrabold text-[#171B3A]">
                        {product.price} <span className="text-[12px] font-bold text-slate-500">ден.</span>
                      </span>
                    </div>

                    {/* VIBER КОПЧЕ ЗА НАРАЧКА */}
                    {isInStock ? (
                      <a
                        href={getViberLink(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7360F2] py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:bg-[#604ed8] active:scale-[0.98]"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Нарачај на Viber
                      </a>
                    ) : (
                      <button
                        disabled
                        className="mt-3 w-full rounded-2xl bg-slate-100 py-2.5 text-[13px] font-bold text-slate-400 cursor-not-allowed"
                      >
                        Моментално нема
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center">
        <p className="text-[12px] text-slate-400">
          Направено со 💙 преку{' '}
          <a href="/" className="font-bold text-[#6366F1] hover:underline">
            catalog.mk
          </a>
        </p>
      </footer>
    </div>
  );
}