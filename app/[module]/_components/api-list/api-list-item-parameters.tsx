'use client';
import { defsAtom } from '@/app/atoms/def';
import { TriangleRightIcon } from '@radix-ui/react-icons';
import cx, { clsx } from 'clsx';
import { useAtomValue } from 'jotai';
import { isNil, upperFirst } from 'lodash';
import { useMemo, useState } from 'react';
import { Tooltip } from '../tooltip';
import { APIParameter } from './typing';
import { FINAL_KIND_ALIAS_MAP, KIND_ALIAS_MAP, buildType, getDef } from './utils/schema/format';

interface APIParameterListProps {
  data?: APIParameter[];
  required?: string[];
  firstLayer?: boolean;
}

/**
 * 参数列表
 * @returns
 */
export function APIParameterList({ data, required, firstLayer }: APIParameterListProps) {
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
                    <div className='inline-block font-field-label font-bold text-sm max-w-1/2 text-ellipsis mr-2 '>
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
                <Type parameter={p} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function Type(props: { parameter: APIParameter }) {
  const defs = useAtomValue(defsAtom);
  const [open, setOpen] = useState(false);
  const fieldName = upperFirst(props.parameter.name);

  const [data, required] = useMemo(() => {
    if (isNil(props.parameter.$ref) || isNil(defs)) return [[], []];
    const def = getDef(props.parameter.$ref);
    return [buildType(def, true), def.required];
  }, [defs, props.parameter.$ref]);

  if (data.length !== 0) {
    return (
      <>
        <div
          className='flex items-center space-x-2 cursor-default font-fira-code'
          onClick={() => setOpen((open) => !open)}>
          {props.parameter.kind === 'array' ? `Array<${fieldName}>` : fieldName}
          <TriangleRightIcon className={open ? 'transition w-5 h-5 rotate-90' : 'transition w-5 h-5'} />
        </div>
        {open ? (
          <APIParameterList
            required={required}
            data={data}
          />
        ) : null}
      </>
    );
  }
  let typeMap = KIND_ALIAS_MAP
  let lowerName = props.parameter.name.toLowerCase()
  if(lowerName.endsWith("id")||lowerName.endsWith("ids")){
    typeMap = FINAL_KIND_ALIAS_MAP
  }

  if (props?.parameter.kind === 'array' && typeof props.parameter.type === 'string') {
    return <span className='font-fira-code'>Array{`<${typeMap[props.parameter.type] || 'unknown'}>`}</span>;
  }

  if (props.parameter.kind !== 'object' && typeof props.parameter.type === 'string') {
    return <span className='font-fira-code'>{typeMap[props.parameter.kind]}</span>;
  }

  if (typeMap[props.parameter.kind]) {
    return <span className='font-fira-code'>{typeMap[props.parameter.kind]}</span>;
  }

  return <span className='font-fira-code'>unknown</span>;
}

function Description(p: APIParameter) {
  if (p.description) return <Tooltip tooltip={p.description} />;
  if (p.name) return p.name;
  return '无说明';
}
