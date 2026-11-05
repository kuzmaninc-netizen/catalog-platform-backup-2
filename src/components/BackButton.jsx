import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ fallback = '/', className = '' }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(fallback);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[12px] font-semibold text-[#232866] backdrop-blur transition hover:border-primary/40 hover:text-primary ${className}`}
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Врати се
    </button>
  );
}