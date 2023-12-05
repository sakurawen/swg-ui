import { isNil, isString } from 'lodash';
import { OpenAPIV2 } from 'openapi-types';
import { APIParameter, RefProperty } from '../../typing';
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

export function getDefinition(ref: string | undefined, definitions: OpenAPIV2.DefinitionsObject) {
  if (!isString(ref)) throw new Error('get definition error: ref is undefined');
  const originalRef = getOriginalRef(ref);
  if (!isString(originalRef)) throw new Error('get definition error: originalRef is undefined');
  const definition = definitions[originalRef];
  if (isNil(definition)) {
    throw new Error('get definition error: definition is not found');
  }
  return definition;
}

export function buildType(definition: OpenAPIV2.SchemaObject): APIParameter[] {
  let result: APIParameter[] = [];
  if (isNil(definition.properties)) return result;
  const typeKeys = Object.keys(definition.properties || {});
  for (let i = 0; i < typeKeys.length; i++) {
    const name = typeKeys[i];
    const itemType = definition.properties[name];
    let kind = itemType.type as APIParameter['kind'];
    let type = itemType.type as APIParameter['type'];
    let $ref:APIParameter["$ref"]
    if (isReferenceObject(itemType.items)) {
      kind = 'array';
      $ref = itemType.items.$ref
    } else if (itemType.$ref) {
      kind = 'object';
      $ref = itemType.$ref
    } else if (isSchemaObject(itemType.items)) {
      kind = 'array';
      type = itemType.items.type;
    }
    result.push({
      name,
      type,
      kind,
      $ref,
      description: itemType.description || '无说明',
      required: false,
    });
  }
  return result;
}
