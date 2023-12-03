import { OpenAPIV2 } from 'openapi-types';
import { CustomOperationObject } from '@/app/typing';

export type APIRequestParameter = OpenAPIV2.Parameter & { ref?: RefProperty; propertiesList?: RefProperty[] };
export type APIParameter = {
  name: string;
  description?: string;
  type: string | APIParameter[];
  kind: 'string' | 'integer' | 'number' | 'boolean' | 'array' | 'object';
  in?: string;
  required?: boolean;
  raw?: any;
};
export type RefProperty = OpenAPIV2.SchemaObject & { ref?: RefProperty; propertiesList?: RefProperty[] };
