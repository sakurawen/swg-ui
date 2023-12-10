'use client';

import { Link1Icon } from '@radix-ui/react-icons';
import * as React from 'react';

import { SwaggerResource } from '@/app/typing';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useRouter } from 'next/navigation';

export interface CommandProps {
  swaggerResources: SwaggerResource[];
}
export function Command(props: CommandProps) {
  const { swaggerResources } = props;
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'q' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  function handleSwitchModule(path: string) {
    const [, , modulePath = ''] = path.split('/');
    router.push(modulePath);
  }
  
  return (
    <>
      <p className='text-sm cursor-default text-muted-foreground'>
        切换模块{' '}
        <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
          <span className='text-xs'>⌘</span>Q
        </kbd>
      </p>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}>
        <CommandInput placeholder='Type a command or search...' />
        <CommandList>
          <CommandEmpty>无了</CommandEmpty>
          <CommandGroup value='hexl?version=1.9.1.RELEASE' heading='Suggestions'>
            {swaggerResources.map((r) => {
              return (
                <CommandItem
                  value={r.url}
                  key={r.name}
                  onSelect={()=>handleSwitchModule(r.url)}>
                  <Link1Icon className='mr-2 h-4 w-4' />
                  <span>{r.name}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
