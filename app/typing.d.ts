import { OpenAPIV2 } from 'openapi-types';

export type CustomOperationObject = OpenAPIV2.OperationObject<{
  method: OpenAPIV2.HttpMethods;
  path:string
}>;

export type SwaggerResource = {
  name: string;
  url: string;
  swaggerVersion: string;
  location: string;
};

export type CustomTagObject = OpenAPIV2.TagObject & {
  api: Record<string, CustomOperationObject[]>;
};

