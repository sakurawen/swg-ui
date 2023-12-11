import { OpenAPIV2 } from 'openapi-types';
import { APIParameter } from '../../typing';
import { getDef, isReferenceObject, isSchemaObject } from './format';
import { isItemsObject } from '../schema/format';

export function buildRequest(input: OpenAPIV2.Parameters): APIParameter[] {
  const output: APIParameter[] = [];
  input.forEach((param) => {
    let type: APIParameter['type'] = 'unknown';
    let kind: APIParameter['kind'] = 'string';
    let name = 'unknown';
    let base = {
      in: 'unknown',
      required: false,
      description: '',
      flag: 'noFlag',
    };
    if (isReferenceObject(param)) {
      const definition = getDef(param.$ref);
      console.log({ definition });
      base.flag = 'RefParam';
      throw new Error('todo;fixme');
    } else if (isReferenceObject(param.schema)) {
      name = param.name || 'unknown';
      kind = 'object';
      base.description = param.description || '无说明';
      base.in = param.in;
      base.required = param.required || false;
      base.flag += '-RefSchemaParam';
      output.push({
        name,
        type,
        kind,
        raw: param,
        $ref: param.schema.$ref,
        ...base,
      });
    } else if (isSchemaObject(param.schema) && isReferenceObject(param.schema.items)) {
      kind = 'array';
      name = param.name;
      base.in = param.in;
      base.flag += '-RefSchemaItemsParam';
      output.push({
        name,
        type,
        kind,
        $ref: param.schema.items.$ref,
        ...base,
      });
    } else if (isSchemaObject(param.schema) && !isReferenceObject(param.schema.items)) {
      name = param.name;
      kind = 'array';
      type = param.schema.items?.type || (param.schema.type as string) || 'unknown';
      base.in = param.in;
      base.flag += '-RefItemsSchemaParam';
      output.push({
        name,
        type,
        kind,
        ...base,
      });
    } else if (isReferenceObject(param.items)) {
      kind = 'array';
      base.flag += '-RefItemsParam';
      throw new Error('todo;fixme');
    } else if (isItemsObject(param.items)) {
      name = param.name;
      kind = 'array';
      type = param.items?.type || 'unknown';
      base.flag += '-itemsParam';
      base.in = param.in;
      output.push({
        name,
        type,
        raw: param,
        kind,
        ...base,
      });
    } else {
      base.in = param.in;
      base.required = param.required || false;
      base.description = param.description || '无说明';
      name = param.name;
      kind = param.type;
      type = param.type;
      output.push({
        name,
        type,
        kind,
        ...base,
      });
    }
  });
  return output;
}
