import { OpenAPIV2 } from 'openapi-types';
import { CustomOperationObject } from '@/app/typing';

export type APIProperty = OpenAPIV2.Parameter & { ref?: RefProperty };
export type RefProperty = OpenAPIV2.SchemaObject & { ref?: RefProperty; propertiesList?: RefProperty[] };
