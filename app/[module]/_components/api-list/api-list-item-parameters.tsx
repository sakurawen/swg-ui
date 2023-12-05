'use client';
import { TriangleRightIcon } from '@radix-ui/react-icons';
import cx, { clsx } from 'clsx';
import { isNil, upperFirst } from 'lodash';
import { OpenAPIV2 } from 'openapi-types';
import { useMemo, useState } from 'react';
import { Tooltip } from '../tooltip';
import { APIParameter } from './typing';
import { buildType, getDefinition } from './utils/schema/format';

interface APIParameterListProps {
  data?: APIParameter[];
  definitions: OpenAPIV2.DefinitionsObject | undefined;
  required?: string[];
  firstLayer?: boolean;
}

/**
 * 参数列表
 * @returns
 */
export function APIParameterList({ data, definitions, required, firstLayer }: APIParameterListProps) {
  if (!data) return null;
  if ((data?.length || 0) >= 200) {
    return <div className='pl-4'>参数过多不予展示</div>;
  }
  if (data.length === 0) return <span className='pl-4 text-xs font-normal'>无数据</span>;
  return (
    <table className='my-2'>
      <thead>
        <tr>
          <th className={clsx('pb-1 text-xs font-normal', firstLayer && 'pl-4')}>字段名</th>
          <th className='pb-1 text-xs font-normal'>字段类型</th>
        </tr>
      </thead>
      <tbody>
        {data.map((p) => {
          return (
            <tr
              key={p.name}
              className='mb-1.5'>
              <td className='text-sm pr-6 align-top'>
                <div className='flex items-start'>
                  {firstLayer ? (
                    <i
                      className={cx('text-red-500 mr-2 mt-1 select-none', {
                        invisible: !p.required || required?.includes(p.name),
                      })}>
                      *
                    </i>
                  ) : null}
                  <div className='inline-block'>
                    <div
                      onClick={() => {
                        console.log(p);
                      }}
                      className='inline-block font-field-label font-bold text-sm max-w-1/2 text-ellipsis mr-2 '>
                      {p.name}
                    </div>
                    <br />
                    <div className='text-xs text-secondary-foreground mb-1 inline-flex space-x-2 items-center align-middle'>
                      {p.in ? <span>{p.in}</span> : null}
                      <div className='text-ellipsis overflow-hidden inline-block whitespace-nowrap'>
                        <Description {...p} />
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td className='font-normal align-top'>
                <Type
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

function Type(props: { parameter: APIParameter; definitions: OpenAPIV2.DefinitionsObject | undefined }) {
  const { definitions } = props;
  const [open, setOpen] = useState(false);
  const fieldName = upperFirst(props.parameter.name);
  const [data, required] = useMemo(() => {
    if (isNil(props.parameter.$ref) || isNil(definitions)) return [[], []];
    const def = getDefinition(props.parameter.$ref, definitions);
    return [buildType(def), def.required];
  }, [definitions, props.parameter.$ref]);

  if (data.length !== 0 || props.parameter.itemsTypeName) {
    return (
      <>
        <div
          className='flex items-center space-x-2 cursor-default font-fira-code'
          onClick={() => setOpen((open) => !open)}>
          {props.parameter.kind === 'array' ? `Array<${fieldName}>` : fieldName}
          <TriangleRightIcon className={open ? 'transition rotate-90' : 'transition'} />
        </div>
        {open ? (
          <APIParameterList
            required={required}
            data={data}
            definitions={definitions}
          />
        ) : null}
      </>
    );
  }

  if (props?.parameter.kind === 'array' && typeof props.parameter.type === 'string') {
    return <span className='font-fira-code'>Array{`<${KIND_ALIAS_MAP[props.parameter.type] || 'unknown'}>`}</span>;
  }

  if (props.parameter.kind !== 'object' && typeof props.parameter.type === 'string') {
    return <span className='font-fira-code'>{KIND_ALIAS_MAP[props.parameter.kind]}</span>;
  }

  if (KIND_ALIAS_MAP[props.parameter.kind]) {
    return <span className='font-fira-code'>{KIND_ALIAS_MAP[props.parameter.kind]}</span>;
  }

  return <span className='font-fira-code'>unknown</span>;
}

function Description(p: APIParameter) {
  if (p.description) return <Tooltip tooltip={p.description} />;
  if (p.name) return p.name;
  return '无说明';
}
