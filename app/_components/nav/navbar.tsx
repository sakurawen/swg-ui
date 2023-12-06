'use client';
import { SwaggerResource } from '@/app/typing';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ModeToggle } from '../mode-toggle';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { settingAtom } from '@/app/atoms/setting';
import { Button } from '@/components/ui/button';
import { EnterFullScreenIcon, ExitFullScreenIcon } from '@radix-ui/react-icons';
import { selectAtom } from 'jotai/utils';
import { useCallback } from 'react';
import cx from 'clsx';
import './navbar.css';

type NavbarProps = {
  swaggerResources: SwaggerResource[];
};

export function Navbar(props: NavbarProps) {
  const { swaggerResources } = props;
  const router = useRouter();
  const [setting, setSetting] = useAtom(settingAtom);
  const { module } = useParams();
  const searchParams = useSearchParams();
  const currentModule = `/docs/${module}?${searchParams.toString()}`;

  function handleSwitchModule(path: string) {
    const [, , modulePath = ''] = path.split('/');
    router.push(modulePath);
  }
  const full = useAtomValue(
    selectAtom(
      settingAtom,
      useCallback((s) => s.full, [])
    )
  );

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
          <Select
            onValueChange={handleSwitchModule}
            value={currentModule}>
            <SelectTrigger className='w-[460px]'>
              <SelectValue placeholder='选择模块'>{currentModule}</SelectValue>
            </SelectTrigger>
            <SelectContent className='w-[460px]'>
              {swaggerResources.map((resource) => {
                return (
                  <SelectItem
                    key={resource.name}
                    value={resource.url}>
                    <div>
                      <span className='mr-2'>{resource.name}</span>
                      <span className='text-xs'> ({resource.url})</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
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
