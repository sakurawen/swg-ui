
export async function GET() {
  const swgResource = await fetch(`${process.env.URL}/swagger/swagger-resources`);
  return Response.json(await swgResource.json());
}
