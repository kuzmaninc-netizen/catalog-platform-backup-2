import { useEffect, useState } from 'react';
import { Loader2, LogOut, Plus, Settings2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Brand from '@/components/Brand';
import StoreSetup from '@/components/admin/StoreSetup';
import StoreShareCard from '@/components/admin/StoreShareCard';
import SubscriptionBanner from '@/components/admin/SubscriptionBanner';
import StoreSettingsSheet from '@/components/admin/StoreSettingsSheet';
import ProductRow from '@/components/admin/ProductRow';
import ProductFormSheet from '@/components/admin/ProductFormSheet';
import { catalogApi } from '@/api/catalog';
import { base44 } from '@/api/base44Client';
import { clearSession, getSession } from '@/lib/merchantSession';
import BackButton from '@/components/BackButton';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      let result = await catalogApi('myStore');
      if (!result.store) {
        const legacy = getSession();
        if (legacy?.merchantId && legacy?.accessKey) {
          const claimed = await catalogApi('claimStore', legacy);
          if (claimed.store) {
            clearSession();
            result = await catalogApi('myStore');
          }
        }
      }
      setData(result);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreated = () => {
    load();
  };

  const handleSaveProduct = async (payload) => {
    setBusy(true);
    setError('');
    try {
      if (editing) {
        await catalogApi('updateProduct', { productId: editing.id, product: payload });
      } else {
        await catalogApi('createProduct', { product: payload });
      }
      setFormOpen(false);
      setEditing(null);
      await load();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleToggleStock = async (product, checked) => {
    setBusy(true);
    try {
      await catalogApi('updateProduct', {
        productId: product.id,
        product: { ...product, is_in_stock: checked },
      });
      await load();
    } catch (toggleError) {
      setError(toggleError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await catalogApi('deleteProduct', { productId: deleteTarget.id });
      setDeleteTarget(null);
      await load();
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSaveStore = async (payload) => {
    setBusy(true);
    setError('');
    try {
      await catalogApi('updateStore', { store: payload });
      setSettingsOpen(false);
      await load();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout('/login');
  };

  if (error && !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <h1 className="font-heading text-lg font-extrabold text-[#171B3A]">Каталогот не е достапен</h1>
        <p className="mt-2 max-w-xs text-[13px] text-slate-500">{error}</p>
        <button
          type="button"
          onClick={load}
          className="mt-6 rounded-2xl bg-[#232866] px-5 py-3 text-[13px] font-bold text-white"
        >
          Обиди се повторно
        </button>
        <button type="button" onClick={handleLogout} className="mt-3 text-[12px] font-semibold text-slate-400">
          Одјави се
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!data.store) {
    return <StoreSetup onCreated={handleCreated} />;
  }

  const { store, products = [], categories = [] } = data;
  const inStock = products.filter((product) => product.is_in_stock !== false).length;

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <BackButton fallback="/" />
            <Brand size="sm" />
          </div>
          <a
            href={`/${store.slug}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-200 px-3.5 py-1.5 text-[12px] font-semibold text-[#232866] transition hover:border-primary/40 hover:text-primary"
          >
            Види каталог
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-4 py-5">
        <div>
          <h1 className="font-heading text-[22px] font-extrabold tracking-tight text-[#171B3A]">
            {store.business_name}
          </h1>
          <p className="mt-0.5 text-[12.5px] text-slate-500">Панел за управување со каталогот</p>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-3.5 py-2.5 text-[12px] font-medium text-rose-700">
            {error}
          </div>
        )}

        <SubscriptionBanner store={store} />

        <StoreShareCard store={store} />

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Производи</p>
            <p className="font-heading text-xl font-extrabold text-[#171B3A]">{products.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">На залиха</p>
            <p className="font-heading text-xl font-extrabold text-emerald-600">{inStock}</p>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-[0_14px_34px_-30px_rgba(35,40,102,0.6)]">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-[14px] font-extrabold text-[#171B3A]">Производи</h2>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-[#6366F1] px-3 py-2 text-[12px] font-bold text-white transition active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" /> Додај
            </button>
          </div>

          {products.length === 0 ? (
            <p className="px-1 py-8 text-center text-[12.5px] text-slate-400">
              Сè уште нема производи. Додај го првиот производ за да го споделиш каталогот.
            </p>
          ) : (
            <div className="mt-1 divide-y divide-slate-100">
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  busy={busy}
                  onToggleStock={handleToggleStock}
                  onEdit={(item) => {
                    setEditing(item);
                    setFormOpen(true);
                  }}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </section>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-semibold text-[#232866] transition hover:border-primary/40"
          >
            <Settings2 className="h-4 w-4" /> Уреди податоци на продавницата
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-[12px] font-semibold text-slate-400 transition hover:text-slate-600"
          >
            <LogOut className="h-3.5 w-3.5" /> Одјави се
          </button>
        </div>
      </main>

      <ProductFormSheet
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        product={editing}
        categories={categories}
        onSave={handleSaveProduct}
        busy={busy}
      />

      <StoreSettingsSheet
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        store={store}
        onSave={handleSaveStore}
        busy={busy}
      />

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Избриши производ?</AlertDialogTitle>
            <AlertDialogDescription>
              „{deleteTarget?.name}“ ќе биде трајно избришан од твојот каталог.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Откажи</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl bg-destructive text-white hover:bg-destructive/90"
            >
              Избриши
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}