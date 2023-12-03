import { Tooltip as TooltipRoot, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function Tooltip({ tooltip }: { tooltip: string }) {
  if (tooltip.length < 32) return tooltip;
  return (
    <TooltipRoot>
      <TooltipTrigger className='cursor-default inline'>
        <div className='w-[20em] overflow-hidden whitespace-nowrap text-ellipsis'>{tooltip}</div>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </TooltipRoot>
  );
}
