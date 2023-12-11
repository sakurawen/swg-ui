import { SwaggerResource } from '@/app/typing';
import { formatDocument } from '../atoms/setting';
import { OpenAPIV2 } from 'openapi-types';

export async function getSwaggerResource(): Promise<SwaggerResource[]> {
  try {
    const swgResource = await fetch(
      process.env.NODE_ENV === 'production'
        ? 'https://swg.akumanoko.com/api/swagger/resource'
        : `http://localhost:3000/api/swagger/resource`
    );
    return swgResource.json();
  } catch (err) {
    console.error('get swagger resource failed:', err);
    return [];
  }
}

export async function getSwaggerModuleData(module: string, version: string): Promise<OpenAPIV2.Document> {
  const res = await fetch(`http://localhost:3000/api/swagger/module`, {
    cache: 'no-store',
    method: 'post',
    body: JSON.stringify({
      module,
      version,
    }),
  });
  const document: OpenAPIV2.Document = await res.json();
  formatDocument(document);
  return document;
}
