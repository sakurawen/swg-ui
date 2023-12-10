'use client';
import { currentSwaggerTagAtom, formatDocument, settingAtom } from '@/app/atoms/setting';
import cx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { OpenAPIV2 } from 'openapi-types';
import { useCallback } from 'react';
import useSWR from 'swr';
import { APIList } from './api-list';
import { SideBar } from './side-bar';
import { Loading } from '@/app/_components/app-loading';

async function fetchSwaggerModuleData(module: string, version: string): Promise<OpenAPIV2.Document> {
  const res = await fetch(`http://localhost:3000/api/swagger/module`, {
    cache: 'no-store',
    method: 'post',
    body: JSON.stringify({
      module,
      version,
    }),
  });
  const document: OpenAPIV2.Document = await res.json();
  formatDocument(document);
  return document;
}

type SwaggerAppProps = {
  module: string;
  version: string;
};
export function SwaggerApp(props: SwaggerAppProps) {
  const { module, version } = props;
  const [currentTagName, setCurrentTagName] = useAtom(currentSwaggerTagAtom);

  const full = useAtomValue(
    selectAtom(
      settingAtom,
      useCallback((s) => s.full, [])
    )
  );

  const { data: document, isLoading } = useSWR(
    [module, version],
    ([module, version]) => fetchSwaggerModuleData(module, version),
    {
      onSuccess(data) {
        if (data?.tags?.[0].name && currentTagName === undefined) {
          setCurrentTagName(data.tags[0].name);
        }
      },
    }
  );

  if (isLoading || !document) return <Loading />;

  return (
    <div className={cx('flex overflow-hidden  mx-auto', full ? 'w-full' : 'max-w-7xl')}>
      <SideBar
        tags={document?.tags}
        selectTagName={currentTagName}
        onTagChange={(tag) => setCurrentTagName(tag.name)}
      />
      <div className='flex-1 h-full px-1'>
        <APIList
          tags={document?.tags}
          definitions={document.definitions}
          currentTagName={currentTagName}
        />
      </div>
    </div>
  );
}
