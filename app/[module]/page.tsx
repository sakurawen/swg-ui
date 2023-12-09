import { notFound } from 'next/navigation';
import { SwaggerApp } from './_components/swagger-app';
import { Suspense } from 'react';

export const revalidate = 3000;

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
  if (!module || !version) return notFound();
  return (
    <Suspense fallback='loading...'>
      <SwaggerApp
        module={module}
        version={version}
      />
    </Suspense>
  );
}

export default Module;
