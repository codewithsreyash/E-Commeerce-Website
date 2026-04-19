import { cn } from '../../lib/utils';

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-none bg-[#5C94FC]/20 border-2 border-black', className)} />;
}
