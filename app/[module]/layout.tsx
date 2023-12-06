import { Loading } from '@/app/_components/app-loading';
import { Navbar } from '@/app/_components/nav';
import { SwaggerResource } from '@/app/typing';
import { notFound } from 'next/navigation';
import { PropsWithChildren, Suspense } from 'react';

async function getSwaggerResource(): Promise<SwaggerResource[]> {
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
