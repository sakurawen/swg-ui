import { OpenAPIV2 } from 'openapi-types';

export async function POST(request: Request) {
  const body = await request.json();
  const { version, module } = body;
  const path = `docs/${module}?version=${version}`;
  const reqUrl = `http://114.132.233.183:8080/swagger/${path}`;
  const res = await fetch(reqUrl, { cache: 'no-store' });
  const document: OpenAPIV2.Document = await res.json();
  return Response.json(document);
}
