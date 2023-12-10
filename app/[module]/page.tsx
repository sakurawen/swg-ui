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
  if (!module || !version) return null;
  return (
    <SwaggerApp
      module={module}
      version={version}
    />
  );
}

export default Module;
