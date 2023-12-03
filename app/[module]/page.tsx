import { notFound } from 'next/navigation';
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
    <div className='pt-16'>
      <Swagger path={path} />
    </div>
  );
}

export default Module;
