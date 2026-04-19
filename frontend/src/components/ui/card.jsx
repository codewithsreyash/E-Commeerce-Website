import { cn } from '../../lib/utils';

export function Card({ className, ...props }) {
  return <div className={cn('retro-card rounded-none p-6', className)} {...props} />;
}
