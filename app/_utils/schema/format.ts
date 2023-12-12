import { isNil, isString, upperFirst } from 'lodash';
import { OpenAPIV2 } from 'openapi-types';
import { APIParameter } from '@/app/[module]/_components/api-list/typing';
import { getDefaultStore } from 'jotai';
import { defsAtom } from '@/app/atoms/def';
const store = getDefaultStore();

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

export function getDef(ref: string | undefined) {
  if (!isString(ref)) throw new Error('get definition error: ref is undefined');
  const originalRef = getOriginalRef(ref);
  if (!isString(originalRef)) throw new Error('get definition error: originalRef is undefined');
  const defs = store.get(defsAtom);
  const def = defs[originalRef];
  if (isNil(def)) {
    throw new Error('get definition error: definition is not found');
  }
  return def;
}

export function buildType(definition: OpenAPIV2.SchemaObject, useRequired: boolean): APIParameter[] {
  let result: APIParameter[] = [];
  if (isNil(definition.properties)) return result;
  const typeKeys = Object.keys(definition.properties || {});
  for (let i = 0; i < typeKeys.length; i++) {
    const name = typeKeys[i];
    const itemType = definition.properties[name];
    let kind = itemType.type as APIParameter['kind'];
    let type = itemType.type as APIParameter['type'];
    let $ref: APIParameter['$ref'];
    if (isReferenceObject(itemType.items)) {
      kind = 'array';
      $ref = itemType.items.$ref;
    } else if (itemType.$ref) {
      kind = 'object';
      $ref = itemType.$ref;
    } else if (isSchemaObject(itemType.items)) {
      kind = 'array';
      type = itemType.items.type;
    }
    const required = itemType.required?.includes(name);
    result.push({
      name,
      type,
      kind,
      $ref,
      description: itemType.description || '无说明',
      required: useRequired ? required : false,
    });
  }
  return result;
}

export const KIND_ALIAS_MAP = {
  integer: 'number',
  number: 'number',
  string: 'string',
  boolean: 'boolean',
  file: 'File',
  object: 'Record<string,any>',
} as Record<string, string>;

/**
 * 传输时，id字段会加密，所以是字符串类型
 */
export const FINAL_KIND_ALIAS_MAP = {
  integer: 'string',
  number: 'string',
  string: 'string',
  boolean: 'boolean',
  file: 'File',
  object: 'Record<string,any>',
} as Record<string, string>;

export function buildDTS(parameters: APIParameter[], useRequired: boolean = false) {
  const result: string[] = [];
  parameters.forEach((p) => {
    const dtsInterface = buildDTSType(p, useRequired);
    result.push(Array.isArray(dtsInterface) ? dtsInterface.join('\n') : dtsInterface || '');
  });
  return result.join('\n');
}

export function buildDTSType(parameter: APIParameter, useRequired: boolean) {
  if (parameter.kind === '__params' && Array.isArray(parameter.type)) {
    const parameters = parameter.type.map((p) => {
      return `  /**
   * ${p.description}
   */\n  ${p.name}${p.required ? '' : '?'}: ${resolveDTSRefParameterKind(p)};`;
    });
    return `interface ${parameter.name} {
${parameters.join('\n')}
}`;
  }
  if (!parameter.$ref) {
    let TypeMap = KIND_ALIAS_MAP;
    const lowerName = parameter.name.toLowerCase();
    if (lowerName.endsWith('id') || lowerName.endsWith('ids')) {
      TypeMap = FINAL_KIND_ALIAS_MAP;
    }
    if (parameter.kind === 'object') return `type ${parameter.name} = Record<string,any>;`;
    if (parameter.kind === 'array' && typeof parameter.type === 'string') {
      return `type ${upperFirst(parameter.name)} = Array<${TypeMap[parameter.type] || 'unknown'}>;`;
    }
    return `type ${upperFirst(parameter.name)} = ${TypeMap[parameter.kind] || 'unknown'};`;
  }

  function getRefFlag(p: APIParameter) {
    return `${upperFirst(p.name)}->${p.$ref}`;
  }

  function resolveDTSRefParameterKind(parameter: APIParameter) {
    if (!isNil(parameter.$ref)) {
      if (!$refSet.has(getRefFlag(parameter))) {
        $refSet.add(getRefFlag(parameter));
        $refs.push({ kind: parameter.kind, flag: getRefFlag(parameter) });
      }
      if (parameter.kind === 'array') {
        return `Array<${upperFirst(parameter.name)}>`;
      }
      return upperFirst(parameter.name);
    }
    let TypeMap = KIND_ALIAS_MAP;
    const lowerName = parameter.name.toLowerCase();
    if (lowerName.endsWith('id') || lowerName.endsWith('ids')) {
      TypeMap = FINAL_KIND_ALIAS_MAP;
    }
    if (parameter.kind === 'array' && typeof parameter.type === 'string') {
      return `Array<${TypeMap[parameter.type] || 'unknown'}>`;
    }
    return TypeMap[parameter.kind] || 'unknown';
  }

  function buildDTSRefParameters(def: OpenAPIV2.SchemaObject, useRequired: boolean) {
    const refParameters = buildType(def, useRequired);
    return refParameters.map(
      (p) => `  /**
   * ${p.description}
   */\n  ${p.name}${p.required ? '' : '?'}: ${resolveDTSRefParameterKind(p)};`
    );
  }

  const $refSet = new Set<string>([getRefFlag(parameter)]);
  const $refs: Array<{
    kind: string;
    flag: string;
  }> = [{ kind: parameter.kind, flag: getRefFlag(parameter) }];

  const resultTypes: Array<{
    name: string;
    def: OpenAPIV2.SchemaObject;
    $ref: string;
    kind: string;
    parameters: string[];
  }> = [];

  while ($refs.length !== 0) {
    const $refItem = $refs.shift();
    if (typeof $refItem?.flag !== 'string') return;
    const [name, $ref] = $refItem.flag.split('->');
    const def = getDef($ref);
    resultTypes.push({
      name,
      def,
      $ref,
      kind: $refItem.kind,
      parameters: buildDTSRefParameters(def, useRequired),
    });
  }

  return resultTypes.map((type, index) => {
    if (type.kind === 'array' && index === 0) {
      return `export type ${upperFirst(type.name)} = Array<{
${type.parameters.join('\n')}
}>
`;
    }
    return `export interface ${upperFirst(type.name)} {
${type.parameters.join('\n')}
}
`;
  });
}
