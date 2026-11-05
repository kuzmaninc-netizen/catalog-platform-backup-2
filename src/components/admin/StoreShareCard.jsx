import { useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { prettyUrl, storeUrl } from '@/lib/merchantSession';

export default function StoreShareCard({ store }) {
  const [copied, setCopied] = useState(false);
  const link = storeUrl(store.slug);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const area = document.createElement('textarea');
      area.value = link;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-[0_14px_34px_-30px_rgba(35,40,102,0.6)]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Твојот линк</p>
          <p className="mt-1 truncate font-heading text-[15px] font-extrabold text-[#171B3A]">
            {prettyUrl(store.slug)}
          </p>
        </div>
        <a
          href={`/${store.slug}`}
          target="_blank"
          rel="noreferrer"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary/40 hover:text-primary"
          aria-label="Отвори каталог"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold transition ${
          copied ? 'bg-emerald-50 text-emerald-700' : 'bg-[#232866] text-white hover:bg-[#2f3580]'
        }`}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? 'Копирано!' : 'Копирај линк'}
      </button>
    </div>
  );
}