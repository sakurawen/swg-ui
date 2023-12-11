import { OpenAPIV2 } from 'openapi-types';
import { atom } from 'jotai';

export const defsAtom = atom<OpenAPIV2.DefinitionsObject>({});
