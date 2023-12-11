import { atomWithHash } from 'jotai-location';
import { atomWithStorage } from 'jotai/utils';
import { OpenAPIV2 } from 'openapi-types';
import { CustomOperationObject, CustomTagObject } from '../typing';

export const settingAtom = atomWithStorage('setting', {
  full: false,
});

export const currentSwaggerTagAtom = atomWithHash<string | undefined>('tag', undefined, {
  setHash: 'replaceState',
});

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

export function formatDocument(document: OpenAPIV2.Document) {
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
  return document;
}
