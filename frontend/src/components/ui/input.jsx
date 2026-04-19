import { cn } from '../../lib/utils';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-none border-2 border-black bg-[#1A1A2E] px-4 text-[10px] text-[#FBD000] outline-none transition-all placeholder:text-[#4a4a6a] focus:border-[#FBD000] focus:shadow-[0_0_8px_rgba(251,208,0,0.4),2px_2px_0px_rgba(0,0,0,0.5)] shadow-[2px_2px_0px_rgba(0,0,0,0.5)] font-['Press_Start_2P',monospace]",
        className,
      )}
      {...props}
    />
  );
}
