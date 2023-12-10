'use client';
import { Icon } from '@iconify/react';

export function Loading() {
  return (
    <div className='h-screen overflow-hidden justify-center items-center'>
      <div className='mx-auto h-full flex flex-col justify-center items-center'>
        <Icon icon="eos-icons:loading" className='w-12 h-12'/>
        <p className='text-center mt-4'>加载中,请坐和放宽...</p>
      </div>
    </div>
  );
}
