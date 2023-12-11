'use client';
import { Loading } from '@/app/_components/app-loading';
import { currentSwaggerTagAtom, settingAtom } from '@/app/atoms/setting';
import { getSwaggerModuleData } from '@/app/service';
import cx from 'clsx';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { useCallback } from 'react';
import useSWR from 'swr';
import { APIList } from './api-list';
import { SideBar } from './side-bar';
import { defsAtom } from '@/app/atoms/def';

type SwaggerAppProps = {
  module: string;
  version: string;
};

export function SwaggerApp(props: SwaggerAppProps) {
  const { module, version } = props;
  const [currentTagName, setCurrentTagName] = useAtom(currentSwaggerTagAtom);
  const setDefs = useSetAtom(defsAtom);

  const full = useAtomValue(
    selectAtom(
      settingAtom,
      useCallback((s) => s.full, [])
    )
  );

  const { data: document, isLoading } = useSWR(
    [module, version],
    ([module, version]) => getSwaggerModuleData(module, version),
    {
      onSuccess(data) {
        if (data.definitions) {
          setDefs(data.definitions);
        }
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
          currentTagName={currentTagName}
        />
      </div>
    </div>
  );
}
