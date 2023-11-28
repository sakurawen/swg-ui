'use client';
import { CustomOperationObject, CustomTagObject } from '@/app/typing';
import { OpenAPIV2 } from 'openapi-types';
import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { APIList } from './api-list';
import { Sidebar } from './sidebar';
import cx from 'clsx';
import { useAtomValue } from 'jotai';
import { settingAtom } from '@/app/atoms/setting';
import { selectAtom } from 'jotai/utils';

type SwaggerProps = {
  path: string;
};

function formatDocumentTagApi(
  path: string,
  pathItemObject: OpenAPIV2.PathItemObject<{ method?: string }>,
  tagsMap: Record<string, CustomTagObject>
) {
  const methods = ['get', 'delete', 'patch', 'put', 'post'] as OpenAPIV2.HttpMethods[];
  methods.forEach((method) => {
    pathItemObject[method]?.tags?.forEach((tag) => {
      if (!Array.isArray(tagsMap?.[tag]?.api[path]) && tagsMap?.[tag]?.api) {
        tagsMap[tag].api[path] = [];
      }
      const api = pathItemObject[method] as CustomOperationObject;
      api.method = method;
      api.path = path;
      tagsMap?.[tag]?.api[path]?.push(api);
    });
  });
}

function formatDocument(document: OpenAPIV2.Document) {
  const tagsMap =
    document.tags?.reduce((acc, cur) => {
      acc[cur.name] = Object.assign(cur, { api: {} });
      return acc;
    }, {} as Record<string, CustomTagObject>) || {};
  const pathKeys = Object.keys(document.paths);
  for (let i = 0; i < pathKeys.length; i++) {
    const pathKey = pathKeys[i];
    const pathObject = document.paths[pathKey];
    formatDocumentTagApi(pathKey, pathObject, tagsMap);
  }
}

async function fetchSwaggerModuleData(path: string): Promise<OpenAPIV2.Document | null> {
  try {
    const reqUrl = `http://114.132.233.183:8080/swagger${path}`;
    const res = await fetch(reqUrl, { cache: 'no-store' });
    const document: OpenAPIV2.Document = await res.json();
    formatDocument(document);
    return document;
  } catch (err) {
    console.error('get swagger data failed:', err);
    return null;
  }
}

export function Swagger(props: SwaggerProps) {
  const { path } = props;

  const [tag, setTag] = useState<OpenAPIV2.TagObject>();

  const { data: document } = useSWR(path, fetchSwaggerModuleData, { suspense: true, fallbackData: null });
  const full = useAtomValue(
    selectAtom(
      settingAtom,
      useCallback((s) => s.full, [])
    )
  );

  return document ? (
    <div className={cx('flex overflow-hidden  mx-auto', full ? 'w-full' : 'max-w-7xl')}>
      <Sidebar
        tags={document?.tags}
        selectTagName={tag?.name}
        onTagChange={setTag}
      />
      <div className='flex-1 h-full px-1'>
        <APIList
          tags={document?.tags}
          definitions={document.definitions}
          tag={tag}
        />
      </div>
    </div>
  ) : null;
}
