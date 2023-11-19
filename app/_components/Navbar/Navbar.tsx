'use client';
import { SwaggerResource } from '@/app/typing';
import { Select } from '@radix-ui/themes';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

type NavbarProps = {
  swaggerResources: SwaggerResource[];
};

export function Navbar(props: NavbarProps) {
  const { swaggerResources } = props;
  const router = useRouter();
  const { module } = useParams();
  const searchParams = useSearchParams();
  const currentModule = `/docs/${module}?${searchParams.toString()}`;

  function handleSwitchModule(path: string) {
    const [, , modulePath = ''] = path.split('/');
    router.push(modulePath);
  }

  return (
    <div className='fixed z-10 w-full h-16  backdrop-blur-sm '>
      <nav className='h-full max-w-7xl mx-auto flex justify-between items-center px-2.5 border-b border-gray-100'>
        <span>Swagger UI</span>
        <Select.Root
          defaultValue={currentModule}
          onValueChange={handleSwitchModule}>
          <Select.Trigger
            variant='soft'
            color='blue'
            defaultValue={currentModule}
            className='min-w-[24em]'>
            Module
          </Select.Trigger>
          <Select.Content className='h-64'>
            <Select.Group>
              {swaggerResources.map((resource) => {
                return (
                  <Select.Item
                    key={resource.name}
                    value={resource.url}>
                    <div>
                      <span className='mr-2'>{resource.name}</span>
                      <span className='text-xs'> ({resource.url})</span>
                    </div>
                  </Select.Item>
                );
              })}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </nav>
    </div>
  );
}
