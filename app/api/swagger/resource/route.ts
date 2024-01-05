
export async function GET() {
  const swgResource = await fetch(`${process.env.API_URL}/swagger/swagger-resources`,{cache:"no-cache"});
  return Response.json(await swgResource.json());
}
