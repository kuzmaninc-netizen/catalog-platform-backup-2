import { cn } from '@/lib/utils';

const sizes = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
};

export default function Brand({ className, size = 'md', tone = 'dark' }) {
  return (
    <span
      className={cn(
        'font-heading font-extrabold tracking-tight leading-none select-none',
        sizes[size],
        className
      )}
    >
      <span className={tone === 'light' ? 'text-white' : 'text-[#232866]'}>catalog.</span>
      <span className="text-[#2DD4BF]">mk</span>
    </span>
  );
}