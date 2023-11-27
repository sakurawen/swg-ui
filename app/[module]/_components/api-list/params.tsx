'use client';
import cx from 'clsx';
import { APIProperty, RefProperty } from './typing';
import { useState } from 'react';
import { TriangleRightIcon } from '@radix-ui/react-icons';

interface PropertyProps {
  title: string;
  data?: APIProperty[];
}
/**
 * 参数列表
 * @returns
 */
export function Property({ title, data }: PropertyProps) {
  if (!data) return null;
  if ((data?.length || 0) >= 100) {
    return <div className='pl-4'>参数过多不予展示</div>;
  }
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <h2 className='pl-4 pb-2 text-base font-bold'>{title} </h2>
      <table>
        <thead>
          <tr>
            <th className='pl-4 pb-1 text-xs font-normal'>字段名</th>
            <th className='pb-1 text-xs font-normal'>字段类型</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((p) => {
            if (!('name' in p)) return null;
            return (
              <tr
                key={p.name}
                className='mb-1.5'>
                <td className='text-sm pr-4 align-top'>
                  <div className='flex items-start'>
                    <i className={cx('text-red-500 mr-2 mt-1 select-none', { invisible: !p.required })}>*</i>
                    <div className='inline-block'>
                      <span
                        className='inline-block font-bold max-w-1/2 text-ellipsis mr-2 '
                        onClick={() => {
                          console.log(p);
                        }}>
                        {p.name}
                      </span>
                      <br />
                      <span className='text-xs'>
                        {p.in}
                        <span className='ml-2'>
                          <ParamDescription {...p} />
                        </span>
                      </span>
                    </div>
                  </div>
                </td>
                <td className='font-normal align-top'>
                  <div>
                    <PropertyRef {...p} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const TYPE_ALIAS_MAP = {
  integer: 'number',
  number: 'number',
  string: 'string',
  boolean: 'boolean',
  object: 'Record<string,any>',
} as Record<string, string>;

function PropertyRef(p: RefProperty | APIProperty) {
  const [open, setOpen] = useState(false);
  const propertiesList = p.ref?.propertiesList || p.propertiesList || [];
  if (propertiesList.length !== 0) {
    const refName = (p.name as string)?.replace(/^(.)/, (_, $1) => {
      return $1.toUpperCase();
    });
    return (
      <>
        <div
          className='flex items-center space-x-2 cursor-default'
          onClick={() => setOpen((open) => !open)}>
          {refName}
          {p.schema.type === 'array' ? '[]' : null}
          <TriangleRightIcon className={open ? 'rotate-90' : ''} />
        </div>
        {open ? (
          <table className='mb-6'>
            <thead>
              <tr>
                <th className='pb-1 text-xs font-normal'>字段名</th>
                <th className='pb-1 text-xs font-normal'>字段类型</th>
              </tr>
            </thead>
            <tbody>
              {propertiesList?.map((p) => {
                if (!('name' in p)) return null;
                return (
                  <tr
                    key={p.name}
                    className='mb-1.5'>
                    <td className='text-sm pr-4 align-top'>
                      <div className='flex items-start'>
                        <div className='inline-block'>
                          <span className='inline-block font-bold max-w-1/2 text-ellipsis mr-2 '>{p.name}</span>
                          <br />
                          <span className='text-xs'>
                            <span>{p.description || '无说明'}</span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className='font-normal align-top'>
                      <div>
                        <PropertyRef {...p} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : null}
      </>
    );
  }
  if (p?.schema?.items) {
    return `${(TYPE_ALIAS_MAP[p.schema.items.type] ?? p.schema.items.type) || 'unknown'}[]`;
  }
  if (!p?.schema?.items && p?.schema?.type) {
    return TYPE_ALIAS_MAP[p.schema.type] || 'unknown';
  }
  if (p.type === 'array' && p?.items?.type) {
    return `${TYPE_ALIAS_MAP[p.items.type] || 'unknown'}[]`;
  }
  if (p.type) return TYPE_ALIAS_MAP[p.type];
  if (p.schema.originalRef && propertiesList.length === 0) {
    return 'Record<string,any>';
  }
}

function ParamDescription(p: APIProperty) {
  if (p.ref?.title) return p.ref.title;
  if (p.description) return p.description;
  return null;
}
