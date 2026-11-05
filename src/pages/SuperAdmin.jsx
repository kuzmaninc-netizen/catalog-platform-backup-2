import { useEffect, useMemo, useState } from 'react';
import { Loader2, LogOut, Search } from 'lucide-react';
import Brand from '@/components/Brand';
import MerchantRow from '@/components/superadmin/MerchantRow';
import SubscriptionEditSheet from '@/components/superadmin/SubscriptionEditSheet';
import RequestsList from '@/components/superadmin/RequestsList';
import { catalogApi } from '@/api/catalog';
import BackButton from '@/components/BackButton';
import { ADMIN_KEY_STORAGE } from '@/config/platform';

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-[14px] text-[#171B3A] outline-none transition placeholder:text-slate-400 focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20';

export default function SuperAdmin() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(ADMIN_KEY_STORAGE) || '');
  const [draftKey, setDraftKey] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [busyId, setBusyId] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async (key) => {
    setLoading(true);
    setError('');
    try {
      const result = await catalogApi('adminOverview', { adminKey: key });
      setData({ merchants: result.merchants || [], requests: result.requests || [] });
    } catch (loadError) {
      setError(loadError.message);
      if (loadError.message.includes('клуч')) {
        sessionStorage.removeItem(ADMIN_KEY_STORAGE);
        setAdminKey('');
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminKey) load(adminKey);
  }, [adminKey]);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!draftKey.trim()) {
      setError('Внеси го пристапниот клуч.');
      return;
    }
    setAuthBusy(true);
    setError('');
    try {
      await catalogApi('adminLogin', { adminKey: draftKey.trim() });
      sessionStorage.setItem(ADMIN_KEY_STORAGE, draftKey.trim());
      setAdminKey(draftKey.trim());
      setDraftKey('');
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    setAdminKey('');
    setData(null);
    setEditing(null);
    setError('');
  };

  const activate = async (merchant) => {
    setBusyId(merchant.id);
    setError('');
    try {
      const current = merchant.subscription_expires_at
        ? new Date(`${String(merchant.subscription_expires_at).slice(0, 10)}T12:00:00`)
        : null;
      const base = current && current.getTime() > Date.now() ? current : new Date();
      base.setDate(base.getDate() + 30);
      await catalogApi('adminUpdateSubscription', {
        adminKey,
        merchantId: merchant.id,
        subscription_status: 'active',
        subscription_plan: merchant.subscription_plan || 'starter',
        subscription_expires_at: base.toISOString().slice(0, 10),
      });
      await load(adminKey);
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setBusyId('');
    }
  };

  const saveSubscription = async (payload) => {
    if (!editing) return;
    setSaving(true);
    setError('');
    try {
      await catalogApi('adminUpdateSubscription', { adminKey, merchantId: editing.id, ...payload });
      setEditing(null);
      await load(adminKey);
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setSaving(false);
    }
  };

  const resolveRequest = async (request) => {
    setBusyId(request.id);
    try {
      await catalogApi('adminResolveRequest', { adminKey, requestId: request.id });
      await load(adminKey);
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setBusyId('');
    }
  };

  const merchants = data?.merchants || [];
  const stats = useMemo(() => {
    const counts = { trial: 0, pending: 0, active: 0, expired: 0 };
    merchants.forEach((merchant) => {
      const status = merchant.subscription_status || 'trial';
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [merchants]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return merchants;
    return merchants.filter((merchant) =>
      [merchant.business_name, merchant.slug, merchant.city, merchant.whatsapp_number, merchant.viber_number]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [merchants, search]);

  if (!adminKey) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
        <div className="w-full max-w-sm">
          <div className="mb-5">
            <BackButton />
          </div>
          <Brand size="md" />
          <h1 className="mt-6 font-heading text-[22px] font-extrabold tracking-tight text-[#171B3A]">
            Супер админ
          </h1>
          <p className="mt-1 text-[12.5px] text-slate-500">
            Внеси го пристапниот клуч за да управуваш со претплатите на сите продавници.
          </p>

          <form onSubmit={handleLogin} className="mt-5 space-y-3">
            <input
              type="password"
              className={inputClass}
              value={draftKey}
              onChange={(event) => setDraftKey(event.target.value)}
              placeholder="Пристапен клуч"
              autoComplete="current-password"
            />
            {error && <p className="text-[12px] font-medium text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={authBusy}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#232866] px-4 py-3.5 text-[14px] font-extrabold text-white transition active:scale-[0.99] disabled:opacity-60"
            >
              {authBusy && <Loader2 className="h-4 w-4 animate-spin" />}
              Влези
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <BackButton />
            <Brand size="sm" />
            <span className="rounded-full bg-[#232866] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Супер админ
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-[11.5px] font-semibold text-slate-500"
          >
            <LogOut className="h-3.5 w-3.5" /> Излези
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-4 py-5">
        {error && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-3.5 py-2.5 text-[12px] font-medium text-rose-700">
            {error}
          </div>
        )}

        {loading && !data ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Продавници', value: merchants.length, tone: 'text-[#171B3A]' },
                { label: 'Активни', value: stats.active, tone: 'text-emerald-600' },
                { label: 'Пробни', value: stats.trial, tone: 'text-amber-600' },
                { label: 'Истечени', value: stats.expired, tone: 'text-rose-600' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-200/70 bg-white px-3.5 py-3">
                  <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">
                    {stat.label}
                  </p>
                  <p className={`font-heading text-xl font-extrabold ${stat.tone}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <RequestsList requests={data?.requests || []} onResolve={resolveRequest} busy={Boolean(busyId)} />

            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className={`${inputClass} pl-10`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Барај по име, линк или телефон"
              />
            </div>

            <section className="space-y-2">
              {filtered.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-10 text-center text-[12.5px] text-slate-400">
                  Нема продавници за ова барање.
                </p>
              ) : (
                filtered.map((merchant) => (
                  <MerchantRow
                    key={merchant.id}
                    merchant={merchant}
                    busy={busyId === merchant.id}
                    onActivate={activate}
                    onEdit={setEditing}
                  />
                ))
              )}
            </section>
          </>
        )}
      </main>

      <SubscriptionEditSheet
        merchant={editing}
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
        onSave={saveSubscription}
        busy={saving}
      />
    </div>
  );
}