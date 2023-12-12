
export async function GET() {
  const swgResource = await fetch(`${process.env.API_URL}/swagger/swagger-resources`);
  return Response.json(await swgResource.json());
}
