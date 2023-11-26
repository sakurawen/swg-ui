'use client';
import { SwaggerResource } from '@/app/typing';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
      <nav className='h-full max-w-7xl mx-auto flex justify-between items-center px-2.5 border-b border-slate-200'>
        <span className='font-bold'>Swagger UI</span>
        <Select
          onValueChange={handleSwitchModule}
          value={currentModule}>
          <SelectTrigger className='w-[460px]'>
            <SelectValue placeholder='选择模块'>{currentModule}</SelectValue>
          </SelectTrigger>
          <SelectContent className='w-[460px]'>
            {swaggerResources.map((resource) => {
              return (
                <SelectItem
                  key={resource.name}
                  value={resource.url}>
                  <div>
                    <span className='mr-2'>{resource.name}</span>
                    <span className='text-xs'> ({resource.url})</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </nav>
    </div>
  );
}
