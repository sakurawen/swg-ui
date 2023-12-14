'use client';
import { Command } from '@/app/_components/cmdk';
import { SwaggerResource } from '@/app/typing';
import { ModeToggle } from '../mode-toggle';
import './navbar.css';

type NavbarProps = {
  swaggerResources: SwaggerResource[];
};

export function Navbar(props: NavbarProps) {
  const { swaggerResources } = props;

  return (
    <div className='fixed z-10 w-full h-16 overflow-hidden backdrop-blur-lg bg-background/40'>
      <nav className='h-full w-full mx-auto flex  justify-between items-center px-2.5 border-b'>
        <div className='relative'>
          <span className='font-bold'>スワッガー・ユーアイ</span>
          <div className='point opacity-30 dark:opacity-60'></div>
        </div>
        <div className='flex items-center space-x-2'>
          <Command swaggerResources={swaggerResources} />
          <ModeToggle />
        </div>
      </nav>
    </div>
  );
}
