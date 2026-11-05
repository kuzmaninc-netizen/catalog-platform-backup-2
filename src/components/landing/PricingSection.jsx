import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'За бизнис што почнува',
    priceMonthly: '490',
    priceYearly: '4.900',
    features: [
      'До 30 производи во каталогот',
      'До 3 категории за подобри пребарувања',
      'Означување на распродадени артикли',
      'Нарачки директно на Viber',
      'Instagram и Facebook профил во био',
      'Стандардна Viber/E-mail поддршка',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'За бизнис што расте',
    featured: true,
    priceMonthly: '890',
    priceYearly: '8.900',
    features: [
      'Неограничен број на производи и категории',
      'Нарачки на Viber + WhatsApp',
      'Напредни беџови (Попуст, Нов производ, Бестселер)',
      'Instagram и Facebook поврзани директно во каталогот',
      'Приоритетна 1-на-1 поддршка и помош за поставување',
    ],
  },
];

export default function PricingSection() {
  return (
    <section id="ceni" className="border-t border-slate-200/70 bg-white/70 py-16">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">Пробен период и пакети</p>
        <h2 className="mt-2 max-w-2xl font-heading text-2xl font-extrabold tracking-tight text-[#171B3A] sm:text-3xl">
          7 дена бесплатно, потоа пакет што расте со твојот бизнис
        </h2>
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-slate-600">
          Секој нов каталог добива целосен пристап 7 дена — без обврска и без онлајн наплата.
          По седмиот ден избираш пакет, а активирањето го договараме директно во порака.
        </p>

        <div className="mt-8 rounded-3xl border border-indigo-100 bg-gradient-to-br from-[#EEF0FF] to-[#E7FBF7] p-6">
          <div className="flex items-center gap-2 text-[#232866]">
            <Sparkles className="h-4 w-4 text-accent" />
            <p className="font-heading text-[15px] font-extrabold">7-дневен пробен период</p>
          </div>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-slate-600">
            Целосен каталог, нарачки на Viber и WhatsApp, колку сакаш производи — сè вклучено.
            Ако не ти одговара, едноставно не продолжуваш.
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col rounded-3xl border bg-white p-6 shadow-[0_14px_40px_-34px_rgba(35,40,102,0.6)] ${
                plan.featured ? 'border-[#6366F1]/40 ring-1 ring-[#6366F1]/15' : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-heading text-lg font-extrabold text-[#171B3A]">{plan.name}</h3>
                  <p className="mt-0.5 text-[12px] text-slate-500">{plan.tagline}</p>
                </div>
                {plan.featured && (
                  <span className="rounded-full bg-[#232866] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Препорачано
                  </span>
                )}
              </div>

              <div className="mt-4">
                <p className="font-heading text-[32px] font-extrabold leading-none text-[#171B3A]">
                  {plan.priceMonthly} <span className="text-[14px] font-bold text-slate-500">ден / мес</span>
                </p>
                <p className="mt-1 text-[12px] font-medium text-emerald-600">
                  или {plan.priceYearly} ден / година <span className="text-slate-400 font-normal">(2 месеци гратис)</span>
                </p>
              </div>

              <div className="mt-3 rounded-xl bg-slate-50 px-3 py-1.5 text-[11.5px] font-semibold text-[#6366F1]">
                ⚡ 7 дена бесплатно пред првата претплата
              </div>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[13px] leading-relaxed text-slate-600">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`mt-6 inline-flex items-center justify-center rounded-2xl px-5 py-3 text-[13.5px] font-bold transition active:scale-[0.99] ${
                  plan.featured
                    ? 'bg-[#6366F1] text-white shadow-[0_14px_28px_-16px_rgba(99,102,241,0.9)] hover:bg-[#5457e5]'
                    : 'border border-[#232866]/15 bg-white text-[#232866] hover:border-[#232866]/30'
                }`}
              >
                Започни со {plan.name}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[12px] leading-relaxed text-slate-400">
          Активирањето го договараме директно преку Viber или WhatsApp — без автоматско продолжување и без скриени трошоци.
        </p>
      </div>
    </section>
  );
}