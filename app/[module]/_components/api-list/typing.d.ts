import { OpenAPIV2 } from 'openapi-types';
import { CustomOperationObject } from '@/app/typing';

export type APIRequestParameter = OpenAPIV2.Parameter & { ref?: RefProperty; propertiesList?: RefProperty[] };
export type APIParameter = {
  name: string;
  description?: string;
  type: string | APIParameter[];
  // __params是构造dts的时候手动构建的数组类型
  kind: 'string' | 'integer' | 'number' | 'boolean' | 'array' | 'object' | '__params';
  in?: string;
  required?: boolean;
  raw?: any;
  itemsTypeName?: string;
  /**
   * 标记
   */
  flag?: string;
  /**
   * 引用
   */
  $ref?: string;
};
export type RefProperty = OpenAPIV2.SchemaObject;
