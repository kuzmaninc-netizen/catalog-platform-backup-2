import { useRef, useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { compressImage } from '@/lib/imageCompress';

export default function ImagePicker({ value, onChange, label = 'Додај слика', className = 'h-24 w-24' }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setBusy(true);
    setError('');
    try {
      const compressed = await compressImage(file);
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file: compressed });
      onChange(file_url);
    } catch (uploadError) {
      setError(uploadError?.message || 'Сликата не може да се прикачи.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-400 transition hover:border-primary/50 hover:text-primary ${className}`}
      >
        {busy ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : value ? (
          <Image src={value} fittingType="fill" className="h-full w-full" />
        ) : (
          <span className="flex flex-col items-center gap-1 text-[10px] font-semibold">
            <ImagePlus className="h-5 w-5" />
            {label}
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      {error && <p className="mt-1 max-w-[140px] text-[10.5px] font-medium text-destructive">{error}</p>}
    </div>
  );
}