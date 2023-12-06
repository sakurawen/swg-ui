'use client';
import { currentSwaggerTagAtom, formatDocument, settingAtom } from '@/app/atoms/setting';
import cx from 'clsx';
import { atom, useAtom, useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { OpenAPIV2 } from 'openapi-types';
import { useCallback, useMemo } from 'react';
import { APIList } from './api-list';
import { SideBar } from './side-bar';

async function fetchSwaggerModuleData({
  module,
  version,
}: {
  module: string;
  version: string;
}): Promise<OpenAPIV2.Document> {
  const res = await fetch(
    process.env.NODE_ENV === 'production'
      ? 'https://swg.akumanoko.com/api/swagger/module'
      : `http://localhost:3000/api/swagger/module`,
    {
      cache: 'no-store',
      method: 'post',
      body: JSON.stringify({
        module,
        version,
      }),
    }
  );
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
  
  const fetcherAtom = useMemo(() => {
    return atom<Promise<OpenAPIV2.Document>>(async () => {
      return await fetchSwaggerModuleData({ module, version });
    });
  }, [module, version]);

  const document = useAtomValue(fetcherAtom);

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
