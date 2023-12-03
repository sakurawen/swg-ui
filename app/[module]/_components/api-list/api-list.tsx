'use client';
import { CustomOperationObject, CustomTagObject } from '@/app/typing';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OpenAPIV2 } from 'openapi-types';
import { useMemo } from 'react';
import { APIListItem } from './api-list-item';
import { Accordion } from '@/components/ui/accordion';


type ApiListProps = {
  tags: OpenAPIV2.Document['tags'];
  definitions: OpenAPIV2.Document['definitions'];
  currentTagName?: string;
};

export function APIList({ tags, currentTagName, definitions }: ApiListProps) {
  const [apiRecord, apiPaths] = useMemo<[Record<string, CustomOperationObject[]>, string[]]>(() => {
    const menu = tags?.find((t) => t.name === currentTagName) as CustomTagObject;
    if (!menu) return [{}, []];
    const paths = Object.keys(menu.api);
    return [menu.api, paths];
  }, [currentTagName, tags]);

  return (
    <ScrollArea className='h-[calc(100vh-64px)] pt-2 pb-1'>
      <div className='space-y-2'>
        <Accordion type='multiple'>
          {apiPaths.map((path) => {
            return apiRecord?.[path].map((api) => {
              return (
                <APIListItem
                  data={api}
                  definitions={definitions}
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
