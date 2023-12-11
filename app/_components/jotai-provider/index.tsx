'use client';
import { Provider, getDefaultStore } from 'jotai';
import { PropsWithChildren } from 'react';
import { DevTools } from 'jotai-devtools';

const defaultStore = getDefaultStore();
export function JotaiProvider({ children }: PropsWithChildren) {
  return (
    <Provider store={defaultStore}>
      <DevTools />
      {children}
    </Provider>
  );
}
