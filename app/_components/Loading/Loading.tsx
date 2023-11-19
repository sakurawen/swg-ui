'use client';
import { Loader2 } from 'lucide-react';

export function Loading() {
  return (
    <div className='pt-36'>
      <div className='mx-auto flex justify-center items-center'>
        <Loader2 className='w-12 h-12 animate-spin' />
      </div>
    </div>
  );
}
