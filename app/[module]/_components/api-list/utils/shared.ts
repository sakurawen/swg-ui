import { isNil } from 'lodash';
import { OpenAPIV2 } from 'openapi-types';
import { APIParameter, RefProperty } from '../typing';
import { cloneDeep } from 'lodash';

export function isReferenceObject(obj?: any): obj is OpenAPIV2.ReferenceObject {
  if (!obj) return false;
  return !isNil(obj?.$ref);
}

export function isSchemaObject(schema?: OpenAPIV2.Schema): schema is OpenAPIV2.SchemaObject {
  if (!schema) return false;
  return !isReferenceObject(schema);
}

export function isItemsObject(obj?: OpenAPIV2.ItemsObject | OpenAPIV2.ReferenceObject): obj is OpenAPIV2.ItemsObject {
  if (!obj) return false;
  return !isReferenceObject(obj);
}

export function getOriginalRef($ref: string) {
  return $ref.split('/').at(-1);
}

export function buildType(
  properties: Record<string, OpenAPIV2.SchemaObject> | undefined,
  definitions: OpenAPIV2.DefinitionsObject
): Array<APIParameter> {
  const result: APIParameter[] = [];
  if (!properties) return result;
  for (let key in properties) {
    const p = properties[key];
    let type = p.type as unknown as APIParameter[] | string;
    let kind = p.type;

    if (isSchemaObject(p.items)) {
      kind = p.items.type;
      type = p.items.type as string;
    } else if (isReferenceObject(p.items)) {
      const originalRef = getOriginalRef(p.items.$ref);
      if (!originalRef) throw new Error('originalRef is undefined');
      const definition = definitions[originalRef];
      type = buildType(definition.properties, definitions);
      kind = 'array';
    } else if (isReferenceObject(p)) {
      const originalRef = getOriginalRef(p.$ref);
      if (!originalRef) throw new Error('originalRef is undefined');
      const definition = definitions[originalRef];
      type = buildType(definition.properties, definitions);
    }

    result.push({
      name: key,
      description: (p as any).description as unknown as string,
      type: type as APIParameter['type'],
      kind: kind as APIParameter['kind'],
    });
  }
  return result;
}

export function buildRef(ref: OpenAPIV2.SchemaObject, definitions: OpenAPIV2.DefinitionsObject): RefProperty {
  if (ref.properties) {
    Object.values(ref.properties).forEach((refProperty) => {
      if (isReferenceObject(refProperty.items)) {
        const originalRef = getOriginalRef(refProperty.items.$ref);
        if (!originalRef) throw new Error('originalRef is undefined');
        const definition = definitions[originalRef];
        refProperty.name = definition.title;
        refProperty.kind = 'array';
        //@ts-expect-error 用于递归
        refProperty.type = buildType(definition.properties, definitions);
        return ref;
      } else if (isSchemaObject(refProperty.items)) {
        refProperty.name = refProperty.items.title;
        refProperty.kind = refProperty.items.type;
        refProperty.type = refProperty.items.type;
        return ref;
      } else if (isReferenceObject(refProperty)) {
        const originalRef = getOriginalRef(refProperty.$ref);
        if (!originalRef) throw new Error('originalRef is undefined');
        const definition = definitions[originalRef];
        //@ts-expect-error 用于递归
        refProperty.name = definition.title;
        //@ts-expect-error 用于递归
        refProperty.kind = definition.type;
        //@ts-expect-error 用于递归
        refProperty.type = buildType(definition.properties, definitions);
        return ref;
      }
    });
  }
  return ref;
}
