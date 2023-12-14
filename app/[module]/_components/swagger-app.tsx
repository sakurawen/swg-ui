'use client';
import { Loading } from '@/app/_components/app-loading';
import { defsAtom } from '@/app/atoms/def';
import { currentSwaggerTagAtom } from '@/app/atoms/setting';
import { getSwaggerModuleData } from '@/app/service';
import { useAtom, useSetAtom } from 'jotai';
import useSWR from 'swr';
import { BlockList } from './block-list';
import { SideBar } from './side-bar';

type SwaggerAppProps = {
  module: string;
  version: string;
};

export function SwaggerApp(props: SwaggerAppProps) {
  const { module, version } = props;
  const [currentTagName, setCurrentTagName] = useAtom(currentSwaggerTagAtom);
  const setDefs = useSetAtom(defsAtom);

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
    <div className='flex overflow-hidden  mx-auto w-full'>
      <SideBar
        tags={document?.tags}
        selectTagName={currentTagName}
        onTagChange={(tag) => setCurrentTagName(tag.name)}
      />
      <div className='flex-1 h-full px-1'>
        <BlockList
          tags={document?.tags}
          currentTagName={currentTagName}
        />
      </div>
    </div>
  );
}
