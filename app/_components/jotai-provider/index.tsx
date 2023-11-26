'use client';
import { Provider } from 'jotai';
import { PropsWithChildren } from 'react';
import { DevTools } from 'jotai-devtools';

export function JotaiProvider({ children }: PropsWithChildren) {
  return (
    <Provider>
      <DevTools />
      {children}
    </Provider>
  );
}
