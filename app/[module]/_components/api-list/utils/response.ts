import { OpenAPIV2 } from 'openapi-types';
import { APIParameter } from '../typing';
import { buildType, buildRef, getOriginalRef, isReferenceObject } from './shared';
import { camelCase, upperFirst } from 'lodash';

function buildResponseAPIParameter(
  name: string,
  originalRef: string | undefined,
  definitions: OpenAPIV2.DefinitionsObject
): APIParameter {
  if (!originalRef) throw new Error('originalRef is undefined');
  const definition = definitions[originalRef];
  const ref = buildRef(definition, definitions);
  const type = buildType(ref.properties,definitions);
  let kind = definition.type as APIParameter['kind'];
  if (typeof type === 'object') {
    kind = 'object';
  }

  return {
    name,
    type,
    kind,
    description: ref.title,
  };
}

export function buildResponseParameters(
  method: string,
  path: string,
  responses: OpenAPIV2.ResponsesObject | undefined,
  definitions: OpenAPIV2.DefinitionsObject | undefined
): APIParameter[] {
  const name = upperFirst(method) + upperFirst(camelCase(path.replace('/v1/{organizationId}', ''))) + 'Response';
  const success = responses?.['200'];
  if (!success || !definitions) return [];
  if (isReferenceObject(success)) {
    const originalRef = getOriginalRef(success.$ref);
    if (!originalRef) throw new Error('originalRef is undefined');
    const response = buildResponseAPIParameter(name, originalRef, definitions);
    return [response];
  } else {
    if (isReferenceObject(success.schema)) {
      const originalRef = getOriginalRef(success.schema.$ref);
      if (!originalRef) throw new Error('originalRef is undefined');
      const response = buildResponseAPIParameter(name, originalRef, definitions);
      return [response];
    } else if (success.schema && isReferenceObject(success.schema?.items)) {
      const originalRef = getOriginalRef(success.schema.items.$ref);
      if (!originalRef) throw new Error('originalRef is undefined');
      const response = buildResponseAPIParameter(name, originalRef, definitions);
      response.kind = 'array';
      return [response];
    }
  }
  return [];
}
