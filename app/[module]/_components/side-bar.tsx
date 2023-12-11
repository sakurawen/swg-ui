'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import cx from 'clsx';
import { OpenAPI, OpenAPIV2 } from 'openapi-types';
type SidebarProps = {
  tags: OpenAPI.Document['tags'];
  selectTagName: string | undefined;
  onTagChange?: (tag: OpenAPIV2.TagObject) => void;
};

export function SideBar({ tags, onTagChange, selectTagName }: SidebarProps) {
  return (
    <menu className='px-1 flex-shrink-0'>
      <ScrollArea className='h-[calc(100vh-64px)] mt-16 pb-1'>
        <ul className='pt-1'>
          {tags?.map((tag) => {
            return (
              <li
                key={tag.name}
                className='w-full'
                onClick={() => onTagChange?.(tag)}>
                <div
                  className={cx(
                    'transition-all text-base select-none py-2 text-foreground rounded-sm px-2.5',
                    'hover:bg-primary-foreground  hover:text-foreground dark:hover:bg-primary-foreground dark:hover:text-foreground',
                    {
                      '!text-background !bg-primary ': tag.name === selectTagName,
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
