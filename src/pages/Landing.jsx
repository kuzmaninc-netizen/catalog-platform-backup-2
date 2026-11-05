import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, MessageCircle, Zap } from 'lucide-react';
import Brand from '@/components/Brand';
import SiteFooter from '@/components/SiteFooter';
import MiniStorePreview from '@/components/MiniStorePreview';
import PricingSection from '@/components/landing/PricingSection';

const features = [
  {
    icon: Zap,
    title: 'Готово за 2 минути',
    text: 'Внеси го името на бизнисот, додај неколку производи и линкот е спремен за Instagram био.',
  },
  {
    icon: MessageCircle,
    title: 'Нарачки на Viber и WhatsApp',
    text: 'Клиентот ја пополнува нарачката, а кај тебе пристигнува уредна порака со производи, количини и адреса.',
  },
  {
    icon: BadgeCheck,
    title: '0% провизија',
    text: 'Плаќањето останува кај тебе — во готово при преземање, без онлајн наплата и без скриени трошоци.',
  },
];

const steps = [
  { n: '01', title: 'Создај каталог', text: 'Име, лого и Viber број. Линкот се создава автоматски.' },
  { n: '02', title: 'Додај производи', text: 'Слика, цена во денари и категорија. Распродадено се означува со еден клик.' },
  { n: '03', title: 'Сподели го линкот', text: 'Постави го во Instagram и Facebook. Нарачките доаѓаат директно кај тебе.' },
];

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(55%_55%_at_15%_0%,rgba(99,102,241,0.18),transparent_70%),radial-gradient(45%_45%_at_90%_5%,rgba(45,212,191,0.20),transparent_70%)]" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-5">
        <Brand size="md" />
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-full bg-[#232866] px-4 py-2 text-[13px] font-bold text-white shadow-[0_10px_20px_-12px_rgba(35,40,102,0.8)] transition hover:bg-[#2f3580]"
          >
            Најави се
          </Link>
          <Link
            to="/register"
            className="rounded-full border border-[#6366F1]/25 bg-white/80 px-4 py-2 text-[13px] font-bold text-[#6366F1] backdrop-blur transition hover:border-[#6366F1]/50"
          >
            Регистрирај се
          </Link>
        </div>
      </header>

      <main className="relative">
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-16 pt-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-24">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary backdrop-blur"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              За локални бизниси во Македонија
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06 }}
              className="mt-5 font-heading text-[2.15rem] font-extrabold leading-[1.1] tracking-tight text-[#171B3A] sm:text-[2.9rem] lg:text-[3.3rem]"
            >
              catalog.mk го претвора твојот бизнис во{' '}
              <span className="bg-gradient-to-r from-[#6366F1] to-[#2DD4BF] bg-clip-text text-transparent">
                моќен дигитален каталог.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-5 max-w-lg text-[15px] leading-relaxed text-slate-600 sm:text-base"
            >
              Клиентите избираат производи, а нарачката пристигнува директно подготвена на вашиот
              Viber или WhatsApp — брзо, без провизии и без комплицирани платформи.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#232866] px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_16px_30px_-14px_rgba(35,40,102,0.7)] transition hover:bg-[#2f3580] active:scale-[0.99]"
              >
                Направи го мојот каталог
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#kako"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-[15px] font-semibold text-[#232866] transition hover:border-slate-300"
              >
                Како функционира
              </a>
            </motion.div>

            <p className="mt-4 text-[12px] font-medium text-slate-400">
              7 дена бесплатно · Нарачки на Viber и WhatsApp · Без провизии на нарачки
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          >
            <MiniStorePreview />
            <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Пример: Terti &amp; Slatki · catalog.mk/terti-slatki
            </p>
          </motion.div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16">
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_-24px_rgba(35,40,102,0.5)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-[15px] font-extrabold text-[#171B3A]">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <PricingSection />

        <section id="kako" className="border-t border-slate-200/70 bg-white/60 py-16">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#171B3A] sm:text-3xl">
              Три чекори до првата нарачка
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {steps.map((s) => (
                <div key={s.n} className="border-l-2 border-indigo-100 pl-5">
                  <span className="font-heading text-xs font-extrabold tracking-[0.2em] text-accent">{s.n}</span>
                  <h3 className="mt-2 font-heading text-base font-extrabold text-[#171B3A]">{s.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}