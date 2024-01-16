'use client';
import { Provider ,getDefaultStore} from 'jotai';
import { DevTools } from 'jotai-devtools';
import { PropsWithChildren, useMemo } from 'react';

export function JotaiProvider({ children }: PropsWithChildren) {
  const store = useMemo(getDefaultStore,[])
  return (
    <Provider store={store}>
      <DevTools />
      {children}
    </Provider>
  );
}
