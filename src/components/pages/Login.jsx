import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Lock, Mail } from 'lucide-react';
import { loginWithMfa, continueMfa, loginWithGoogle } from '@/lib/authMfa';
import { catalogApi } from '@/api/catalog';
import { safeReturnTo } from '@/lib/authReturnTo';
import Brand from '@/components/Brand';
import BackButton from '@/components/BackButton';
import SiteFooter from '@/components/SiteFooter';
import GoogleIcon from '@/components/GoogleIcon';

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-[14px] text-[#171B3A] outline-none transition placeholder:text-slate-400 focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20';

export default function Login() {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const returnTo = safeReturnTo();
  const target = returnTo !== '/' ? returnTo : '/admin';

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const identifier = form.identifier.trim();
    if (!identifier) {
      setError('Внеси е-пошта или телефон.');
      return;
    }
    setLoading(true);
    try {
      let email = identifier.toLowerCase();
      if (!identifier.includes('@')) {
        const resolved = await catalogApi('loginEmail', { identifier });
        if (!resolved.email) {
          setError('Не најдовме сметка со овој број. Регистрирај се или влези со е-пошта.');
          return;
        }
        email = resolved.email;
      }
      const result = await loginWithMfa(email, form.password);
      if (result.mfa_required) {
        await continueMfa(result, target);
        return;
      }
      window.location.href = target;
    } catch (loginError) {
      setError(
        loginError.message || 'Погрешна е-пошта, телефон или лозинка. Обиди се повторно.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle(target);
    } catch (googleError) {
      setError(googleError.message || 'Не успеа влегувањето со Google.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="px-5 py-4">
        <BackButton />
      </div>

      <main className="flex flex-1 items-center justify-center px-5 pb-8">
        <div className="w-full max-w-md">
          <Brand size="md" />
          <h1 className="mt-6 font-heading text-[26px] font-extrabold tracking-tight text-[#171B3A]">
            Влези во панелот
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
            Внеси ја е-поштата или телефонот со кој ја отвори сметката.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-3.5 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_-32px_rgba(35,40,102,0.6)]"
          >
            <div className="space-y-1.5">
              <label htmlFor="identifier" className="block text-[12px] font-semibold text-slate-600">
                Е-пошта или телефон
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="identifier"
                  className={inputClass}
                  value={form.identifier}
                  onChange={update('identifier')}
                  placeholder="ime@primer.mk или 070 123 456"
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-[12px] font-semibold text-slate-600">
                  Лозинка
                </label>
                <Link to="/forgot-password" className="text-[11.5px] font-semibold text-primary hover:underline">
                  Заборавена лозинка?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  className={inputClass}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-destructive/10 px-3 py-2.5 text-[12px] font-medium text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#232866] px-4 py-3.5 text-[14px] font-extrabold text-white shadow-[0_16px_30px_-16px_rgba(35,40,102,0.7)] transition active:scale-[0.99] disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Влези
            </button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-[10.5px] uppercase tracking-wide">
                <span className="bg-white px-3 text-slate-400">или</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-semibold text-[#232866] transition hover:border-slate-300"
            >
              <GoogleIcon className="h-4 w-4" />
              Продолжи со Google
            </button>
          </form>

          <p className="mt-4 text-center text-[12.5px] text-slate-500">
            Немаш сметка?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Отвори каталог
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}