import { Loading } from '@/app/_components/Loading';
import { Navbar } from '@/app/_components/Navbar';
import { SwaggerResource } from '@/app/typing';
import { notFound } from 'next/navigation';
import { PropsWithChildren, Suspense } from 'react';

async function getSwaggerResource(): Promise<SwaggerResource[]> {
  try {
    const swgResource = await fetch('http://114.132.233.183:8080/swagger/swagger-resources');
    return swgResource.json();
  } catch (err) {
    console.error('get swagger resource failed:', err);
    return [];
  }
}

async function ModuleLayout({ children }: PropsWithChildren) {
  const resourceList = await getSwaggerResource();
  if (!resourceList) return notFound();
  return (
    <Suspense fallback={<Loading />}>
      <Navbar swaggerResources={resourceList} />
      <div className='h-full'>{children}</div>
    </Suspense>
  );
}

export default ModuleLayout;
