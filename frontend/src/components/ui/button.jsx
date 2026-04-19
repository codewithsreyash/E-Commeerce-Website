import { cn } from '../../lib/utils';

const variants = {
  default: 'bg-[#E52521] text-[#FBD000] hover:bg-[#ff3333] border-black',
  secondary: 'bg-[#1A1A2E] text-[#5C94FC] hover:bg-[#16213E] border-black',
  outline: 'border-2 border-[#5C94FC] bg-transparent text-[#5C94FC] hover:bg-[#5C94FC]/10',
  ghost: 'bg-transparent text-[#5C94FC] hover:bg-[#5C94FC]/10',
  danger: 'bg-[#E52521] text-white hover:bg-[#ff3333] border-black',
  success: 'bg-[#43B047] text-white hover:bg-[#52c456] border-black',
  yellow: 'bg-[#FBD000] text-black hover:bg-[#ffe033] border-black',
  blue: 'bg-[#049CD8] text-white hover:bg-[#06b0f0] border-black',
};

const sizes = {
  default: 'h-11 px-5 py-2 text-[10px]',
  sm: 'h-9 px-3 text-[8px]',
  icon: 'h-10 w-10',
};

export function Button({ className, variant = 'default', size = 'default', ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-none border-3 font-medium transition-all duration-100 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-['Press_Start_2P',monospace] shadow-[3px_3px_0px_rgba(0,0,0,0.5)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.5)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-[1px_1px_0px_rgba(0,0,0,0.5)] active:translate-x-[1px] active:translate-y-[1px]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
