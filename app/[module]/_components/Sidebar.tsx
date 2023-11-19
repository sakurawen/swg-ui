'use client';
import { ScrollArea } from '@radix-ui/themes';
import cx from 'clsx';
import { OpenAPI, OpenAPIV2 } from 'openapi-types';

type SidebarProps = {
  tags: OpenAPI.Document['tags'];
  selectTagName: string | undefined;
  onTagChange?: (tag: OpenAPIV2.TagObject) => void;
};

export function Sidebar({ tags, onTagChange, selectTagName }: SidebarProps) {
  return (
    <menu
      className='border-r border-gray-100 px-1 pt-1 flex-shrink-0'
      style={{ height: 'calc(100vh - 64px)' }}>
      <ScrollArea scrollbars='vertical'>
        <ul>
          {tags?.map((tag) => {
            return (
              <li
                key={tag.name}
                className='w-full'
                onClick={() => onTagChange?.(tag)}>
                <div
                  className={cx(
                    'text-base select-none py-2 hover:bg-[var(--accent-a3)] hover:text-[var(--accent-12)] rounded-md px-2.5',
                    {
                      'bg-[var(--accent-a3)] text-[var(--accent-12)] ring-1 ring-[var(--accent-a4)] ring-inset':
                        tag.name === selectTagName,
                    }
                  )}>
                  <span>{tag.name}</span>
                  <br />
                  <span className='text-sm font-normal'>{tag.description}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </menu>
  );
}
