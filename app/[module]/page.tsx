import { notFound } from 'next/navigation';
import { SwaggerApp } from './_components/swagger-app';

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
    <SwaggerApp
      module={module}
      version={version}
    />
  );
}

export default Module;
