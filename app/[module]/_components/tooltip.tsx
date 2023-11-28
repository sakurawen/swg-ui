import { Tooltip as TooltipRoot, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function Tooltip({ tooltip }: { tooltip: string }) {
  if (tooltip.length < 32) return tooltip;
  return (
    <TooltipRoot>
      <TooltipTrigger className='cursor-default'>
        <span className='inline-block w-[20em] text-ellipsis overflow-hidden whitespace-nowrap'>{tooltip}</span>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </TooltipRoot>
  );
}
