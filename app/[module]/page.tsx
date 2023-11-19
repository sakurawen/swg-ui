import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Swagger } from './_components/swagger';

type ModuleProps = {
  params: {
    module: string;
  };
  searchParams: {
    version?: string;
  };
};

async function Module(props: ModuleProps) {
  const {
    params: { module },
    searchParams: { version },
  } = props;
  const path = `/docs/${module}?version=${version}`;
  if (!module || !path) return notFound();
  return (
    <div className='max-w-7xl mx-auto pt-16'>
      <Suspense fallback='loading...'>
        <Swagger path={path} />
      </Suspense>
    </div>
  );
}

export default Module;
