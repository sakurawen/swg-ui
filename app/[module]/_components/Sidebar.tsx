'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import cx from 'clsx';
import { OpenAPI, OpenAPIV2 } from 'openapi-types';
type SidebarProps = {
  tags: OpenAPI.Document['tags'];
  selectTagName: string | undefined;
  onTagChange?: (tag: OpenAPIV2.TagObject) => void;
};

export function Sidebar({ tags, onTagChange, selectTagName }: SidebarProps) {
  return (
    <menu className='px-1 flex-shrink-0'>
      <ScrollArea className='h-[calc(100vh-64px)] pt-2 pb-1'>
        <ul>
          {tags?.map((tag) => {
            return (
              <li
                key={tag.name}
                className='w-full'
                onClick={() => onTagChange?.(tag)}>
                <div
                  className={cx(
                    'transition-all text-base select-none py-2 hover:bg-slate-100 text-slate-700 hover:text-slate-950 rounded-sm px-2.5',
                    {
                      '!text-white !bg-slate-900': tag.name === selectTagName,
                    }
                  )}>
                  <span className='font-normal'>{tag.description}</span>
                  <br />
                  <span className='text-xs'>{tag.name}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </menu>
  );
}
