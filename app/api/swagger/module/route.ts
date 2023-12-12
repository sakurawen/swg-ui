import { OpenAPIV2 } from 'openapi-types';

export async function POST(request: Request) {
  const body = await request.json();
  const { version, module } = body;
  const path = `docs/${module}?version=${version}`;
  const reqUrl = `${process.env.API_URL}/swagger/${path}`;
  const res = await fetch(reqUrl, { cache: 'no-store' });
  const document: OpenAPIV2.Document = await res.json();
  return Response.json(document);
}
