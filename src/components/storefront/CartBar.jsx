import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { formatMKD } from '@/lib/format';

export default function CartBar({ count, total, onOpen }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 safe-bottom"
        >
          <div className="mx-auto flex max-w-xl items-center justify-between gap-3 rounded-2xl bg-[#0F1424] px-3.5 py-3 shadow-[0_20px_40px_-15px_rgba(15,20,36,0.7)]">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
                <ShoppingBag className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] font-medium text-white/50">{count} {count === 1 ? 'производ' : 'производи'}</p>
                <p className="text-[14px] font-extrabold leading-tight text-white">{formatMKD(total)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpen}
              className="flex items-center gap-1 rounded-xl bg-accent px-3.5 py-2.5 text-[13px] font-extrabold text-[#062B27] transition active:scale-[0.98]"
            >
              Прегледај корпа
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}