import { OpenAPIV2 } from 'openapi-types';
import { createContext } from 'react';

export const DefinitionsContext = createContext<{
  definitions?: OpenAPIV2.DefinitionsObject;
}>({
  definitions: {},
});
