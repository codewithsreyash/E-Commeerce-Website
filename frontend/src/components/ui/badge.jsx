import { cn } from '../../lib/utils';

const variants = {
  default: 'bg-[#1A1A2E] text-[#5C94FC] border-black',
  success: 'bg-[#43B047] text-white border-black',
  warning: 'bg-[#FBD000] text-black border-black',
  danger: 'bg-[#E52521] text-white border-black',
  info: 'bg-[#049CD8] text-white border-black',
};

export function Badge({ className, variant = 'default', ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-none border-2 px-3 py-1 text-[17px] font-semibold tracking-wide shadow-[2px_2px_0px_rgba(0,0,0,0.4)] font-['Press_Start_2P',monospace]",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
