import { Facebook, Instagram, MapPin } from 'lucide-react';
import { Image } from '@/components/ui/image';

function instagramUrl(handle) {
  if (!handle) return null;
  const value = String(handle).trim().replace(/^@/, '');
  if (!value) return null;
  return value.startsWith('http') ? value : `https://instagram.com/${value}`;
}

function facebookUrl(handle) {
  if (!handle) return null;
  const value = String(handle).trim();
  if (!value) return null;
  return value.startsWith('http') ? value : `https://${value.replace(/^\/+/, '')}`;
}

export default function StoreHeader({ store, categories, activeCategory, onCategoryChange }) {
  const instagram = instagramUrl(store.instagram);
  const facebook = facebookUrl(store.facebook_url);

  return (
    <header className="border-b border-slate-200/70 bg-white">
      <div className="mx-auto max-w-3xl px-4 pb-3 pt-6">
        <div className="flex items-start gap-3.5">
          {store.logo_url ? (
            <Image
              src={store.logo_url}
              fittingType="fill"
              className="h-14 w-14 shrink-0 rounded-2xl ring-1 ring-slate-200"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl brand-gradient text-xl font-extrabold text-white">
              {store.business_name?.[0]?.toUpperCase() || 'C'}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="truncate font-heading text-xl font-extrabold leading-tight tracking-tight text-[#171B3A]">
              {store.business_name}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {store.city && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                  <MapPin className="h-3 w-3" /> {store.city}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                Нарачки на Viber / WhatsApp
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[#232866] transition hover:border-primary/40 hover:text-primary"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {facebook && (
              <a
                href={facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[#232866] transition hover:border-primary/40 hover:text-primary"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {store.bio_text && (
          <p className="mt-3 text-[13px] leading-relaxed text-slate-500">{store.bio_text}</p>
        )}
      </div>

      {categories.length > 0 && (
        <div className="no-scrollbar mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 pb-3">
          <button
            type="button"
            onClick={() => onCategoryChange(null)}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition ${
              activeCategory === null
                ? 'bg-[#232866] text-white'
                : 'border border-slate-200 bg-white text-slate-500 hover:text-[#232866]'
            }`}
          >
            Сите
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition ${
                activeCategory === category
                  ? 'bg-[#232866] text-white'
                  : 'border border-slate-200 bg-white text-slate-500 hover:text-[#232866]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}