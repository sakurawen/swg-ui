'use client';
import { TriangleRightIcon } from '@radix-ui/react-icons';
import cx from 'clsx';
import { OpenAPIV2 } from 'openapi-types';
import { useState } from 'react';
import { Tooltip } from '../tooltip';
import { APIProperty, RefProperty } from './typing';

interface APIPropertiesProps {
  title: string;
  data?: APIProperty[];
  definitions: OpenAPIV2.DefinitionsObject | undefined;
}

/**
 * 参数列表
 * @returns
 */
export function APIProperties({ title, data, definitions }: APIPropertiesProps) {
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
                        onClick={() => {
                          console.log(p);
                        }}
                        className='inline-block font-bold max-w-1/2 text-ellipsis mr-2 '>
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
                  <PropertyRef
                    {...p}
                    definitions={definitions}
                  />
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

function PropertyRef(props: RefProperty | APIProperty) {
  const [open, setOpen] = useState(false);
  const propertiesList = props.ref?.propertiesList || props.propertiesList || [];
  if (propertiesList.length !== 0) {
    const refName = (props.name as string)?.replace(/^(.)/, (_, $1) => {
      return $1.toUpperCase();
    });
    return (
      <>
        <div
          className='flex items-center space-x-2 cursor-default'
          onClick={() => setOpen((open) => !open)}>
          {refName}
          {props?.schema?.type === 'array' || props.type === 'array' ? '[]' : null}
          <TriangleRightIcon className={open ? 'rotate-90' : ''} />
        </div>
        {open ? (
          <table className='mb-6'>
            <thead>
              <tr>
                <th className='pb-1 pt-2 text-xs font-normal'>字段名</th>
                <th className='pb-1 pt-2 text-xs font-normal'>字段类型</th>
              </tr>
            </thead>
            <tbody>
              {propertiesList?.map((property) => {
                if (!('name' in property)) return null;
                return (
                  <tr
                    key={property.name}
                    className='mb-1.5'>
                    <td className='text-sm pr-4 align-top'>
                      <div className='flex items-start'>
                        <div className='inline-block'>
                          <span
                            onClick={() => {
                              console.log(property, props.definitions);
                            }}
                            className='inline-block font-bold max-w-1/2 text-ellipsis mr-2 '>
                            {property.name}
                          </span>
                          <br />
                          <span className='text-xs'>
                            <span>
                              <Tooltip tooltip={property.description || '无说明'} />{' '}
                            </span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className='font-normal align-top'>
                      <div>
                        <PropertyRef {...property} />
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
  if (props?.schema?.items) {
    return `${(TYPE_ALIAS_MAP[props.schema.items.type] ?? props.schema.items.type) || 'unknown'}[]`;
  }
  if (!props?.schema?.items && props?.schema?.type) {
    return TYPE_ALIAS_MAP[props.schema.type] || 'unknown';
  }
  if (props.type === 'array' && props?.items?.type) {
    return `${TYPE_ALIAS_MAP[props.items.type] || 'unknown'}[]`;
  }
  if (props.type) return TYPE_ALIAS_MAP[props.type];
  if (props?.schema?.originalRef && propertiesList.length === 0) {
    return 'Record<string,any>';
  }
}

function ParamDescription(p: APIProperty) {
  if (p.ref?.title) return p.ref.title;
  if (p.description) return <Tooltip tooltip={p.description} />;
  return null;
}
