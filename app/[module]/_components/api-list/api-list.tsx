'use client';
import { CustomOperationObject, CustomTagObject } from '@/app/typing';
import { ScrollArea } from '@radix-ui/themes';
import { OpenAPIV2 } from 'openapi-types';
import { useMemo } from 'react';
import { APIListItem } from './api-list-item';

type ApiListProps = {
  tags: OpenAPIV2.Document['tags'];
  tag?: OpenAPIV2.TagObject;
};

export function APIList({ tags, tag }: ApiListProps) {
  const [apiRecord, apiPaths] = useMemo<[Record<string, CustomOperationObject[]>, string[]]>(() => {
    const menu = tags?.find((t) => t.name === tag?.name) as CustomTagObject;
    if (!menu) return [{}, []];
    const paths = Object.keys(menu.api);
    return [menu.api, paths];
  }, [tag, tags]);

  return (
    <ScrollArea>
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
    </ScrollArea>
  );
}
