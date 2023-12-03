'use client';
import { currentSwaggerTagAtom, fetchSwaggerModuleData, settingAtom } from '@/app/atoms/setting';
import cx from 'clsx';
import { atom, useAtom, useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { OpenAPIV2 } from 'openapi-types';
import { useCallback, useMemo } from 'react';
import { APIList } from './api-list';
import { Sidebar } from './sidebar';

type SwaggerProps = {
  path: string;
};

export function Swagger(props: SwaggerProps) {
  const { path } = props;

  const [currentTagName, setCurrentTagName] = useAtom(currentSwaggerTagAtom);
  const full = useAtomValue(
    selectAtom(
      settingAtom,
      useCallback((s) => s.full, [])
    )
  );

  const fetcherAtom = useMemo(() => {
    return atom<Promise<OpenAPIV2.Document>>(async () => {
      return await fetchSwaggerModuleData(path);
    });
  }, [path]);

  const document = useAtomValue(fetcherAtom);
  
  return (
    <div className={cx('flex overflow-hidden  mx-auto', full ? 'w-full' : 'max-w-7xl')}>
      <Sidebar
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
