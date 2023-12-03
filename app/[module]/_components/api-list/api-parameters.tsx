'use client';
import { TriangleRightIcon } from '@radix-ui/react-icons';
import cx from 'clsx';
import { OpenAPIV2 } from 'openapi-types';
import { useState } from 'react';
import { Tooltip } from '../tooltip';
import { APIParameter } from './typing';
import { upperFirst } from 'lodash';

interface APIParameterListProps {
  data?: APIParameter[];
  definitions: OpenAPIV2.DefinitionsObject | undefined;
}

/**
 * 参数列表
 * @returns
 */
export function APIParameterList({ data, definitions }: APIParameterListProps) {
  if (!data) return null;
  if ((data?.length || 0) >= 100) {
    return <div className='pl-4'>参数过多不予展示</div>;
  }
  if (data.length === 0) return <span className='pl-4 text-xs font-normal'>无数据</span>;
  return (
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
                    <div className='inline-block font-bold max-w-1/2 text-ellipsis mr-2 '>{p.name}</div>
                    <br />
                    <div className='text-xs inline-flex space-x-2 items-center align-middle'>
                      {p.in ? <span>{p.in}</span> : null}
                      <div className='text-ellipsis overflow-hidden inline-block whitespace-nowrap'>
                        <ParamDescription {...p} />
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td className='font-normal align-top'>
                <RefParameter
                  parameter={p}
                  definitions={definitions}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const KIND_ALIAS_MAP = {
  integer: 'number',
  number: 'number',
  string: 'string',
  boolean: 'boolean',
  object: 'Record<string,any>',
} as Record<string, string>;

function RefParameter(props: { parameter: APIParameter; definitions: OpenAPIV2.DefinitionsObject | undefined }) {
  const [open, setOpen] = useState(false);
  const propertiesList = Array.isArray(props.parameter.type) ? props.parameter.type : [];
  if (propertiesList.length !== 0) {
    const refName = upperFirst(props.parameter.name);
    return (
      <>
        <div
          className='flex items-center space-x-2 cursor-default font-mono'
          onClick={() => setOpen((open) => !open)}>
          {props.parameter.kind === 'array' ? `Array<${refName}>` : refName}
          <TriangleRightIcon className={open ? 'transition rotate-90' : 'transition'} />
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
                          <div
                            onClick={() => {
                              console.log(property);
                            }}
                            className='inline-block font-bold max-w-1/2 text-ellipsis mr-2 '>
                            {property.name}
                          </div>
                          <br />
                          <div className='text-xs whitespace-nowrap inline-block overflow-hidden text-ellipsis'>
                            <Tooltip tooltip={property.description || '无说明'} />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='font-normal align-top'>
                      <div>
                        <RefParameter
                          parameter={property}
                          definitions={props.definitions}
                        />
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

  if (props?.parameter.kind === 'array' && typeof props.parameter.type === 'string') {
    return <span className='font-mono'>Array{`<${KIND_ALIAS_MAP[props.parameter.type] || 'unknown'}>`}</span>;
  }

  if (props.parameter.kind !== 'object' && typeof props.parameter.type === 'string') {
    return <span className='font-mono'>{KIND_ALIAS_MAP[props.parameter.kind]}</span>;
  }

  if (KIND_ALIAS_MAP[props.parameter.kind]) {
    return <span className='font-mono'>{KIND_ALIAS_MAP[props.parameter.kind]}</span>;
  }

  return <span className='font-mono'>unknown</span>;
}

function ParamDescription(p: APIParameter) {
  if (p.description) return <Tooltip tooltip={p.description} />;
  if (p.name) return p.name;
  return '无说明';
}
