import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Brand from '@/components/Brand';

const TAPS_NEEDED = 5;
const TAP_WINDOW = 2000;
const LONG_PRESS = 3000;

export default function SiteFooter() {
  const navigate = useNavigate();
  const taps = useRef([]);
  const timer = useRef(null);
  const opened = useRef(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  const openSecret = () => {
    if (opened.current) return;
    opened.current = true;
    navigate('/super-admin');
  };

  const handleTap = () => {
    const now = Date.now();
    taps.current = [...taps.current, now].filter((stamp) => now - stamp < TAP_WINDOW);
    if (taps.current.length >= TAPS_NEEDED) {
      taps.current = [];
      openSecret();
    }
  };

  const startPress = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(openSecret, LONG_PRESS);
  };

  const stopPress = () => clearTimeout(timer.current);

  return (
    <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 sm:flex-row">
      <div className="flex items-center gap-3">
        <Brand size="sm" />
        <span className="text-[11.5px] text-slate-400">© {new Date().getFullYear()}</span>
      </div>
      <button
        type="button"
        onClick={handleTap}
        onPointerDown={startPress}
        onPointerUp={stopPress}
        onPointerLeave={stopPress}
        onPointerCancel={stopPress}
        onContextMenu={(event) => event.preventDefault()}
        className="select-none touch-manipulation text-[12px] text-slate-400 transition hover:text-slate-500"
      >
        Направено со 💙 во Скопје
      </button>
    </footer>
  );
}