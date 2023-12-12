import { camelCase, isNil, upperFirst } from 'lodash';
import { OpenAPIV2 } from 'openapi-types';
import { APIParameter } from '@/app/[module]/_components/api-list/typing';
import { isReferenceObject } from './format';

export function buildResponse(
  method: string,
  path: string,
  responses: OpenAPIV2.ResponsesObject | undefined
): APIParameter[] {
  const name = upperFirst(method) + upperFirst(camelCase(path.replace('/v1/{organizationId}', ''))) + 'Response';
  const success = responses?.['200'];
  if (isNil(success)) return [];
  let result: APIParameter = {
    name,
    type: '',
    kind: 'string',
    description: '',
    flag: 'noFlag',
  };
  if (isReferenceObject(success)) {
    result.$ref = success.$ref;
    result.flag = 'refResponse';
  } else {
    if (isReferenceObject(success.schema)) {
      result.$ref = success.schema.$ref;
      result.flag = 'schemaRefResponse';
    } else {
      if (isReferenceObject(success.schema?.items)) {
        result.$ref = success.schema?.items.$ref;
        result.kind = 'array';
        result.flag = 'schemaItemsRefResponse';
      } else {
        success.schema?.items;
        result.type = success.schema?.type as 'object';
        result.kind = success.schema?.type as 'object';
        result.flag = 'noRefResponse';
      }
    }
  }
  return [result];
}
