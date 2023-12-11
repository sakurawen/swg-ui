import { Loading } from '@/app/_components/app-loading';
import { Navbar } from '@/app/_components/nav';
import { PropsWithChildren, Suspense } from 'react';
import { getSwaggerResource } from '@/app/service';

export const revalidate = 3600;

async function ModuleLayout({ children }: PropsWithChildren) {
  const resourceList = await getSwaggerResource();
  return (
    <Suspense fallback={<Loading />}>
      <Navbar swaggerResources={resourceList} />
      <div className='h-full'>{children}</div>
    </Suspense>
  );
}

export default ModuleLayout;
