import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Facebook, Loader2, Lock, Mail, Phone } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { continueMfa } from '@/lib/authMfa';
import { safeReturnTo } from '@/lib/authReturnTo';
import { catalogApi } from '@/api/catalog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import Brand from '@/components/Brand';
import BackButton from '@/components/BackButton';
import SiteFooter from '@/components/SiteFooter';
import StoreSetup from '@/components/admin/StoreSetup';

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-[14px] text-[#171B3A] outline-none transition placeholder:text-slate-400 focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'За бизнис што почнува',
    features: ['Каталог со производи и цени', 'Нарачки на Viber и WhatsApp'],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'За бизнис што расте',
    features: ['Сè од Starter', 'Instagram и Facebook во каталогот'],
  },
];

export default function Register() {
  const [step, setStep] = useState('account');
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    viber: '',
    whatsapp: '',
    sameWhatsapp: false,
    facebook: '',
  });
  const [details, setDetails] = useState(null);
  const [plan, setPlan] = useState('starter');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const loginPath = '/login' + (safeReturnTo() !== '/' ? '?returnTo=' + encodeURIComponent(safeReturnTo()) : '');

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setError('');
  };

  const toggleSameWhatsapp = (checked) => {
    setForm((prev) => ({ ...prev, sameWhatsapp: checked, whatsapp: checked ? prev.viber : prev.whatsapp }));
    setError('');
  };

  const viberChanged = (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, viber: value, whatsapp: prev.sameWhatsapp ? value : prev.whatsapp }));
    setError('');
  };

  const handleAccount = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Лозинките не се совпаѓаат.');
      return;
    }
    if (form.viber.replace(/\D/g, '').length < 7) {
      setError('Внеси го Viber бројот на кој ги примаш нарачките.');
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email: form.email.trim(), password: form.password });
      setStep('otp');
    } catch (registerError) {
      setError(registerError.message || 'Не успеа отворањето на сметката.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email: form.email.trim(), otpCode });
      if (result?.mfa_required) {
        await continueMfa(result, '/admin').catch(() => window.location.assign(loginPath));
        return;
      }
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      setStep('store');
    } catch (verifyError) {
      setError(verifyError.message || 'Погрешен код за потврда.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      await base44.auth.resendOtp(form.email.trim());
    } catch (resendError) {
      setError(resendError.message || 'Не успеа повторното испраќање на кодот.');
    }
  };

  const handleDetails = (values) => {
    setDetails(values);
    setStep('plan');
  };

  const handleFinish = async () => {
    if (!details) return;
    setLoading(true);
    setError('');
    try {
      await catalogApi('createStore', { store: details, plan });
      window.location.href = '/admin';
    } catch (createError) {
      setError(createError.message || 'Не успеа создавањето на каталогот.');
      setLoading(false);
    }
  };

  if (step === 'store') {
    return (
      <StoreSetup
        defer
        lockContacts
        stepLabel="Чекор 2 од 3"
        initial={{
          viber_number: form.viber.trim(),
          whatsapp_number: form.sameWhatsapp ? form.viber.trim() : form.whatsapp.trim(),
          facebook_url: form.facebook.trim(),
        }}
        onDetails={handleDetails}
      />
    );
  }

  if (step === 'plan') {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="px-5 py-4">
          <BackButton />
        </div>

        <main className="flex flex-1 items-start justify-center px-5 pb-10">
          <div className="w-full max-w-md">
            <Brand size="md" />
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Чекор 3 од 3</p>
            <h1 className="mt-1.5 font-heading text-[26px] font-extrabold tracking-tight text-[#171B3A]">
              Избери пакет
            </h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
              Првите 7 дена се бесплатни. Потоа продолжуваш со избраниот пакет — активирањето го
              договараме директно преку Viber или WhatsApp.
            </p>

            <div className="mt-6 space-y-3">
              {PLANS.map((option) => {
                const active = plan === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPlan(option.id)}
                    className={`w-full rounded-3xl border bg-white p-4 text-left transition ${
                      active
                        ? 'border-[#6366F1] ring-2 ring-[#6366F1]/20'
                        : 'border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-heading text-[15px] font-extrabold text-[#171B3A]">{option.name}</p>
                        <p className="mt-0.5 text-[12px] text-slate-500">{option.tagline}</p>
                      </div>
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          active ? 'border-[#6366F1] bg-[#6366F1] text-white' : 'border-slate-300 text-transparent'
                        }`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {option.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-[12.5px] text-slate-600">
                          <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12.5px] font-medium text-amber-800">
              7 дена бесплатен пробен период — се активира автоматски штом го создадеш каталогот.
            </div>

            {error && (
              <div className="mt-3 rounded-xl bg-destructive/10 px-3 py-2.5 text-[12px] font-medium text-destructive">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleFinish}
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6366F1] px-4 py-3.5 text-[14px] font-extrabold text-white shadow-[0_14px_28px_-16px_rgba(99,102,241,0.9)] transition active:scale-[0.99] disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Започни 7 дена бесплатно
            </button>
            <p className="mt-3 text-center text-[11.5px] leading-relaxed text-slate-400">
              Без онлајн наплата. Пакетот го активираме со тебе кога ќе одлучиш.
            </p>
          </div>
        </main>

        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="px-5 py-4">
        <BackButton />
      </div>

      <main className="flex flex-1 items-center justify-center px-5 pb-8">
        <div className="w-full max-w-md">
          <Brand size="md" />
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Чекор 1 од 3</p>
          <h1 className="mt-1.5 font-heading text-[26px] font-extrabold tracking-tight text-[#171B3A]">
            {step === 'account' ? 'Отвори сметка' : 'Потврди ја е-поштата'}
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
            {step === 'account'
              ? 'Сметката ти служи за најава во панелот и за примање нарачки од клиентите.'
              : `Пративме 6-цифрен код на ${form.email}.`}
          </p>

          {step === 'account' ? (
            <form
              onSubmit={handleAccount}
              className="mt-6 space-y-3.5 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_-32px_rgba(35,40,102,0.6)]"
            >
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[12px] font-semibold text-slate-600">
                  Е-пошта <span className="text-[#6366F1]">*</span>
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    className={inputClass}
                    value={form.email}
                    onChange={update('email')}
                    placeholder="ime@primer.mk"
                    autoComplete="email"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  На неа пристигнува кодот за потврда. Со истиот број и е-пошта се најавуваш подоцна.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-[12px] font-semibold text-slate-600">
                    Лозинка
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      type="password"
                      className={inputClass}
                      value={form.password}
                      onChange={update('password')}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="confirm" className="block text-[12px] font-semibold text-slate-600">
                    Потврди лозинка
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="confirm"
                      type="password"
                      className={inputClass}
                      value={form.confirmPassword}
                      onChange={update('confirmPassword')}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="viber" className="block text-[12px] font-semibold text-slate-600">
                  Viber број <span className="text-[#6366F1]">*</span>
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="viber"
                    className={inputClass}
                    value={form.viber}
                    onChange={viberChanged}
                    placeholder="070 123 456"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Задолжителен — на овој број ги примаш нарачките.</p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="whatsapp" className="block text-[12px] font-semibold text-slate-600">
                  WhatsApp број <span className="text-[11px] font-normal text-slate-400">(опционално)</span>
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="whatsapp"
                    className={inputClass}
                    value={form.whatsapp}
                    onChange={update('whatsapp')}
                    placeholder="070 123 456"
                    inputMode="tel"
                    disabled={form.sameWhatsapp}
                  />
                </div>
                <label className="flex items-center gap-2 pt-0.5 text-[12px] font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={form.sameWhatsapp}
                    onChange={(event) => toggleSameWhatsapp(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#6366F1] focus:ring-[#6366F1]"
                  />
                  Ист е како Viber
                </label>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="facebook" className="block text-[12px] font-semibold text-slate-600">
                  Facebook страница <span className="text-[11px] font-normal text-slate-400">(опционално)</span>
                </label>
                <div className="relative">
                  <Facebook className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="facebook"
                    className={inputClass}
                    value={form.facebook}
                    onChange={update('facebook')}
                    placeholder="facebook.com/tertislatki"
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
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6366F1] px-4 py-3.5 text-[14px] font-extrabold text-white shadow-[0_14px_28px_-16px_rgba(99,102,241,0.9)] transition active:scale-[0.99] disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Продолжи
              </button>
            </form>
          ) : (
            <div className="mt-6 space-y-4 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_-32px_rgba(35,40,102,0.6)]">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={setOtpCode}
                  autoFocus
                  autoComplete="one-time-code"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && (
                <div className="rounded-xl bg-destructive/10 px-3 py-2.5 text-[12px] font-medium text-destructive">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleVerify}
                disabled={loading || otpCode.length < 6}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#232866] px-4 py-3.5 text-[14px] font-extrabold text-white transition active:scale-[0.99] disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Потврди
              </button>

              <p className="text-center text-[12px] text-slate-500">
                Не доби код?{' '}
                <button type="button" onClick={handleResend} className="font-semibold text-primary hover:underline">
                  Испрати повторно
                </button>
              </p>
            </div>
          )}

          <p className="mt-4 text-center text-[12.5px] text-slate-500">
            Веќе имаш сметка?{' '}
            <Link to={loginPath} className="font-semibold text-primary hover:underline">
              Влези
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}