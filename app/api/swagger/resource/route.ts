
export async function GET() {
  const swgResource = await fetch('http://114.132.233.183:8080/swagger/swagger-resources');
  return Response.json(await swgResource.json());
}
