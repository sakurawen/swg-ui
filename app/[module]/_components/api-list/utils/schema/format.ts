import { isNil, isString, upperFirst } from 'lodash';
import { OpenAPIV2 } from 'openapi-types';
import { APIParameter } from '../../typing';

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

export const KIND_ALIAS_MAP = {
  integer: 'number',
  number: 'number',
  string: 'string',
  boolean: 'boolean',
  object: 'Record<string,any>',
} as Record<string, string>;

export function buildDTS(parameters: APIParameter[], definitions: OpenAPIV2.DefinitionsObject | undefined) {
  const result: string[] = [];
  parameters.forEach((p) => {
    const dtsInterface = buildDTSInterface(p, definitions);
    result.push(Array.isArray(dtsInterface) ? dtsInterface.join('\n') : dtsInterface || '');
  });
  return result.join('\n');
}

export function buildDTSInterface(parameter: APIParameter, definitions: OpenAPIV2.DefinitionsObject | undefined) {
  if (!parameter.$ref) {
    if (parameter.kind === 'object') return `type ${parameter.name} = Record<string,any>;`;
    if (parameter.kind === 'array' && typeof parameter.type === 'string')
      return `type ${parameter.name} = Array<${KIND_ALIAS_MAP[parameter.type] || 'unknown'}>;`;
    return `type ${parameter.name} = ${KIND_ALIAS_MAP[parameter.kind] || 'unknown'};`;
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
    if (parameter.kind === 'array' && typeof parameter.type === 'string') {
      return `Array<${KIND_ALIAS_MAP[parameter.type] || 'unknown'}>`;
    }
    return KIND_ALIAS_MAP[parameter.kind] || 'unknown';
  }

  function buildDTSRefParameters(definition: OpenAPIV2.SchemaObject) {
    const refParameters = buildType(definition);
    return refParameters.map((p) => `  // ${p.description}\n  ${p.name}?: ${resolveDTSRefParameterKind(p)};`);
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
    const def = getDefinition($ref, definitions || {});
    resultTypes.push({
      name,
      def,
      $ref,
      kind: $refItem.kind,
      parameters: buildDTSRefParameters(def),
    });
  }

  return resultTypes.map((type, index) => {
    if (type.kind === 'array' && index === 0) {
      return `export type ${type.name} = Array<{
${type.parameters.join('\n')}
}>
`;
    }
    return `export interface ${type.name} {
${type.parameters.join('\n')}
}
`;
  });
}
