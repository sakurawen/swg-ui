import { OpenAPIV2 } from 'openapi-types';
import { APIParameter } from '../typing';
import { buildType, buildRef, getOriginalRef, isReferenceObject, isSchemaObject } from './shared';

function buildRequestAPIParameter(
  parameter: OpenAPIV2.Parameters[number],
  definitions: OpenAPIV2.DefinitionsObject
): APIParameter | undefined {
  if (!('name' in parameter)) return undefined;
  let type = parameter.type;
  let kind = parameter.type;
  if (parameter?.items?.type) {
    type = parameter?.items?.type;
  }

  if (isSchemaObject(parameter?.schema)) {
    type = (parameter.schema?.items as any)?.type || parameter.schema.type;
    kind = parameter.schema.type;
  }

  const apiParameter: APIParameter = {
    name: parameter.name,
    type,
    kind,
    description: parameter.description,
    in: parameter.in,
    required: parameter.required,
  };

  if (isReferenceObject(parameter?.schema)) {
    apiParameter.kind = 'object';
    const originalRef = getOriginalRef(parameter.schema.$ref);
    if (!originalRef) {
      throw new Error(`originalRef is undefined`);
    }
    const ref = buildRef(definitions[originalRef], definitions);
    apiParameter.type = buildType(ref.properties,definitions);
    return apiParameter;
  }
  if (isSchemaObject(parameter.schema)) {
    if (isReferenceObject(parameter.schema.items)) {
      apiParameter.kind = 'array';
      const originalRef = getOriginalRef(parameter.schema.items.$ref);
      if (!originalRef) {
        throw new Error(`originalRef is undefined`);
      }
      const ref = buildRef(definitions[originalRef], definitions);
      apiParameter.type = buildType(ref.properties,definitions);
      return apiParameter;
    }
  }
  return apiParameter;
}

export function buildRequestParameters(
  parameters?: OpenAPIV2.Parameters | undefined,
  definitions?: OpenAPIV2.DefinitionsObject
): APIParameter[] {
  if (!parameters || !definitions) return [];
  const apiProperties: APIParameter[] = [];
  parameters.forEach((parameter) => {
    if (!('name' in parameter)) return;
    const apiProperty = buildRequestAPIParameter(parameter, definitions);
    if (apiProperty) {
      apiProperties.push(apiProperty);
    }
  });
  return apiProperties;
}
