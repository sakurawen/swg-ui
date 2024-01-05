'use client';
import { Provider } from 'jotai';
import { DevTools } from 'jotai-devtools';
import { PropsWithChildren } from 'react';

export function JotaiProvider({ children }: PropsWithChildren) {
  return (
    <Provider>
      <DevTools />
      {children}
    </Provider>
  );
}
