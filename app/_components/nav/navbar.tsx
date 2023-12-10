'use client';
import { Command } from '@/app/_components/cmdk';
import { settingAtom } from '@/app/atoms/setting';
import { SwaggerResource } from '@/app/typing';
import { Button } from '@/components/ui/button';
import { EnterFullScreenIcon, ExitFullScreenIcon } from '@radix-ui/react-icons';
import cx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { useCallback } from 'react';
import { ModeToggle } from '../mode-toggle';
import './navbar.css';

type NavbarProps = {
  swaggerResources: SwaggerResource[];
};

export function Navbar(props: NavbarProps) {
  const { swaggerResources } = props;
  const full = useAtomValue(
    selectAtom(
      settingAtom,
      useCallback((s) => s.full, [])
    )
  );
  const [setting, setSetting] = useAtom(settingAtom);
 
  return (
    <div className='fixed z-10 w-full h-16 overflow-hidden backdrop-blur-lg bg-background/40'>
      <nav
        className={cx(
          'h-full  mx-auto flex justify-between items-center px-2.5 border-b',
          full ? 'w-full' : 'max-w-7xl'
        )}>
        <div className='relative'>
          <span className='font-bold'>スワッガー・ユーアイ</span>
          <div className='point opacity-30 dark:opacity-60'></div>
        </div>
        <div className='flex items-center space-x-4'>
          <Command swaggerResources={swaggerResources} />
          <ModeToggle />
          <Button
            onClick={() => {
              setSetting((s) => {
                return {
                  ...s,
                  full: !s.full,
                };
              });
            }}
            variant='outline'
            size='icon'>
            {setting.full ? <ExitFullScreenIcon /> : <EnterFullScreenIcon />}
          </Button>
        </div>
      </nav>
    </div>
  );
}
