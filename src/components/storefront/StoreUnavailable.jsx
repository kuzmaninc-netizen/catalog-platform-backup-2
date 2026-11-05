import { Link } from 'react-router-dom';

export default function StoreUnavailable({ store }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-sm">
        🕒
      </div>
      <h1 className="mt-5 font-heading text-xl font-extrabold text-[#171B3A]">
        Продавницата е привремено недостапна
      </h1>
      <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-slate-500">
        {store?.business_name ? `Каталогот на ${store.business_name} ` : 'Овој каталог '}
        моментално не е достапен. Обиди се повторно подоцна или контактирај ја продавницата директно.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-2xl bg-[#232866] px-5 py-3 text-[13px] font-bold text-white"
      >
        Кон catalog.mk
      </Link>
      <Link to="/admin" className="mt-3 text-[12px] font-semibold text-slate-400">
        Сопственик? Активирај претплата
      </Link>
    </div>
  );
}