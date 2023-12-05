import { notFound } from 'next/navigation';
import { SwaggerApp } from './_components/swagger-app';

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
  return <SwaggerApp path={path} />;
}

export default Module;
