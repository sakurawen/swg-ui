import { OpenAPIV2 } from 'openapi-types';
import cx from 'clsx';
import { APIProperty } from './typing';


interface ParamsProps {
  title: string;
  data?: APIProperty[];
}
/**
 * 参数列表
 * @returns
 */
export function Params({ title, data }: ParamsProps) {
  if (!data) return null;
  if ((data?.length || 0) >= 100) {
    return <div className='pl-4'>参数过多不予展示</div>;
  }
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <h2 className='pl-4 pb-2 text-base font-bold'>{title}</h2>
      <table>
        <thead>
          <tr >
            <th className='pl-4 pb-1 text-xs font-normal'>名称</th>
            <th className='pb-1 text-xs font-normal'>类型</th>
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
                      <span className='inline-block font-bold max-w-1/2 text-ellipsis mr-2 '>{p.name}</span>
                      <br />
                      <span className='text-xs'>
                        {p.in}
                        <span className='ml-2'>{renderDescription(p)}</span>
                      </span>
                    </div>
                  </div>
                </td>
                <td className='font-normal align-top'>
                  <div className='flex items-start'>{renderParamType(p)}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function renderDescription(p: APIProperty) {
  if (p.ref?.title) return p.ref.title;
  if (p.description) return p.description;
  return null;
}
function renderParamType(p: APIProperty) {
  if (p?.schema?.items) {
    return `${p.schema.type}<${p.schema.items.type}>`;
  }
  if (p.type === 'array' && p.items.type) {
    return `${p.type}<${p.items.type}>`;
  }
  if (p.type) return p.type;

  return p.name.replace(/^(.)/, (_, $1) => {
    return $1.toUpperCase();
  });
}
