import { OpenAPIV2 } from 'openapi-types';
import cx from 'clsx';

interface ParamsProps {
  title: string;
  data?: {
    query?: OpenAPIV2.Parameters;
    path?: OpenAPIV2.Parameters;
    body?: OpenAPIV2.Parameters;
  };
}
/**
 * 参数列表
 * @returns
 */
export function Params({ title, data }: ParamsProps) {
  if (!data) return null;
  if ((data.body?.length || 0) + (data.path?.length || 0) + (data.query?.length || 0) >= 100) {
    return <div>参数不多不予展示</div>;
  }
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <h2 className='pl-4 py-2 text-base font-bold'>{title}</h2>
      <table>
        <thead>
          <tr>
            <th className='pl-4 text-xs font-normal'>名称</th>
            <th className='text-xs font-normal'>类型</th>
          </tr>
        </thead>
        <tbody>
          {data?.path?.map((p) => {
            if (!('name' in p)) return null;
            return (
              <tr
                key={p.name}
                className='mb-1'>
                <td className='text-sm pr-2'>
                  <i className={cx('text-red-500 mr-2 select-none', { invisible: !p.required })}>*</i>
                  <span className='inline-block max-w-1/2 text-ellipsis mr-2 font-normal'>{p.name}</span>
                </td>
                {p.schema ? <td>ref</td> : <td className='font-normal'>{renderParamType(p)}</td>}
              </tr>
            );
          })}
          {data?.query?.map((p) => {
            if (!('name' in p)) return null;
            return (
              <tr
                key={p.name}
                className='mb-1'>
                <td className='text-sm pr-2'>
                  <i className={cx('text-red-500 mr-2 select-none', { invisible: !p.required })}>*</i>
                  <span className='inline-block max-w-1/2 text-ellipsis mr-2 font-normal'>{p.name}</span>
                </td>
                {p.schema ? <td>ref</td> : <td className='font-normal'>{renderParamType(p)}</td>}
              </tr>
            );
          })}
          {data?.body?.map((p) => {
            if (!('name' in p)) return null;
            return (
              <tr
                key={p.name}
                className='mb-1'>
                <td className='text-sm pr-2'>
                  <i className={cx('text-red-500 mr-2 select-none', { invisible: !p.required })}>*</i>
                  <span className='inline-block max-w-1/2 text-ellipsis mr-2 font-normal'>{p.name}</span>
                </td>
                {p.schema ? <td>ref</td> : <td className='font-normal'>{renderParamType(p)}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function renderParamType(p: OpenAPIV2.Parameter) {
  if (p.items) {
    return `${p.type}<${p.items.type}>`;
  }
  return p.type;
}
