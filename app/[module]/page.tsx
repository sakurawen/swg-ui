import { notFound } from 'next/navigation';
import { SwaggerApp } from './_components/swagger-app';
import { OpenAPIV2 } from 'openapi-types';

export async function fetchSwaggerModuleData({
  module,
  version,
}: {
  module: string;
  version: string;
}): Promise<OpenAPIV2.Document> {
  const res = await fetch(
    process.env.NODE_ENV === 'production'
      ? 'https://swg.akumanoko.com/api/swagger/module'
      : `http://localhost:3000/api/swagger/module`,
    {
      cache: 'no-store',
      method: 'post',
      body: JSON.stringify({
        module,
        version,
      }),
    }
  );
  const document: OpenAPIV2.Document = await res.json();
  return document;
}

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
  const data = await fetchSwaggerModuleData({ module, version });
  return <SwaggerApp data={data} />;
}

export default Module;
