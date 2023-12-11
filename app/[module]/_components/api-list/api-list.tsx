'use client';
import { CustomOperationObject, CustomTagObject } from '@/app/typing';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OpenAPIV2 } from 'openapi-types';
import { useMemo } from 'react';
import { APIListItem } from './api-list-item';
import { Accordion } from '@/components/ui/accordion';


type ApiListProps = {
  tags: OpenAPIV2.Document['tags'];
  currentTagName?: string;
};

export function APIList({ tags, currentTagName }: ApiListProps) {
  const [apiRecord, apiPaths] = useMemo<[Record<string, CustomOperationObject[]>, string[]]>(() => {
    const menu = tags?.find((t) => t.name === currentTagName) as CustomTagObject;
    if (!menu) return [{}, []];
    const paths = Object.keys(menu.api);
    return [menu.api, paths];
  }, [currentTagName, tags]);

  return (
    <ScrollArea className='h-[100vh] pb-2'>
      <div className='space-y-2 mt-16'>
        <Accordion type='multiple'>
          {apiPaths.map((path) => {
            return apiRecord?.[path].map((api) => {
              return (
                <APIListItem
                  data={api}
                  key={api.operationId}
                />
              );
            });
          })}
        </Accordion>
      </div>
    </ScrollArea>
  );
}
