import { getSwaggerResource } from '@/app/service';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home() {
  const data = await getSwaggerResource();
  return (
    <div className='flex flex-col h-screen items-center justify-center'>
      <h2 className='uppercase text-center'>
        just for fun
        <br />
        <div className='text-xs transform  scale-50'>芜湖~</div>
      </h2>
      <div className='max-w-2xl mt-4 flex flex-wrap items-center justify-center'>
        {data.map((item) => {
          return (
            <Link
              key={item.name}
              href={item.url.replace('/docs', '')}>
              <Button
                className='cursor-default'
                variant='link'>
                {item.name}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
