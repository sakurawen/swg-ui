'use client';
import { Icon } from '@iconify/react';

export function Loading() {
  return (
    <div className='h-screen overflow-hidden justify-center items-center'>
      <div className='mx-auto h-full flex justify-center items-center'>
        <Icon icon="eos-icons:loading" className='w-12 h-12'/>
      </div>
    </div>
  );
}
