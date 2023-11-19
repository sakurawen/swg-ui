'use client';
import { Provider as JotaiProvider } from 'jotai';
import { PropsWithChildren } from 'react';

export function Provider({ children }: PropsWithChildren) {
  return <JotaiProvider>{children}</JotaiProvider>;
}
