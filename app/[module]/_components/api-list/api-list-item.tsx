'use client';
import { CustomOperationObject } from '@/app/typing';
import cx from 'clsx';
import { groupBy } from 'lodash';
import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import { OpenAPIV2 } from 'openapi-types';
import { useMemo, useState } from 'react';
import { Badge } from '../badge';
import { Params } from './params';

type ApiListItemProps = {
  data: CustomOperationObject;
};

export function APIListItem({ data }: ApiListItemProps) {
  const [open, setOpen] = useState(false);

  const parameters = useMemo<{
    query?: OpenAPIV2.Parameters;
    path?: OpenAPIV2.Parameters;
    body?: OpenAPIV2.Parameters;
  }>(() => {
    return groupBy(data.parameters, 'in');
  }, [data.parameters]);

  function handleOpenOperation(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen((o) => !o);
    console.log('params:', groupBy(data.parameters, 'in'));
  }
  return (
    <div
      className={cx(
        'py-2 px-2.5 hover:bg-[var(--accent-a3)] rounded-md ring-1 mb-1 ring-inset ring-transparent hover:ring-[var(--accent-a4)]',
        {
          '!ring-[var(--accent-a4)] bg-[var(--accent-a3)] ': open,
        }
      )}>
      <div
        className='flex items-center justify-between'
        onClick={handleOpenOperation}>
        <div>
          <h2>
            <Badge type={data.method} />
            <span onClick={(e) => open && e.stopPropagation()}>{data.summary}</span>
          </h2>
          <p
            className='pl-1 pt-0.5'
            onClick={(e) => open && e.stopPropagation()}>
            {data.path}
          </p>
        </div>
        <i className='text-gray-400 hover:text-gray-950 text-sm p-1'>
          {open ? <ChevronsDownUp className='w-4 h-4' /> : <ChevronsUpDown className='w-4 h-4' />}
        </i>
      </div>
      {open ? (
        <div className='mt-2 bg-white p-2 ring-1 text-left ring-gray-200/50 rounded-md'>
          <Params
            title='Parameters'
            data={parameters}
          />
        </div>
      ) : null}
    </div>
  );
}
