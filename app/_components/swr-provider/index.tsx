'use client';
import { PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';

const config = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};
export function SWRConfigProvider({ children }: PropsWithChildren) {
  return <SWRConfig value={config}>{children}</SWRConfig>;
}
