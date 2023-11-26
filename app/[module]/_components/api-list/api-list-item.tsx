'use client';
import { CustomOperationObject } from '@/app/typing';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Icon } from '@iconify/react';
import { copy } from 'clipboard';
import { sortBy } from 'lodash';
import { useParams } from 'next/navigation';
import { OpenAPIV2 } from 'openapi-types';
import { useMemo } from 'react';
import { Params } from './params';
import { APIProperty, RefProperty } from './typing';

export type APIListItemProps = {
  data: CustomOperationObject;
  definitions: OpenAPIV2.Document['definitions'];
};

function buildRefProperty(ref: OpenAPIV2.SchemaObject, definitions: OpenAPIV2.DefinitionsObject): RefProperty {
  if (ref.properties) {
    Object.values(ref.properties).forEach((refProperty) => {
      if (refProperty.properties) {
        buildRefProperty(refProperty, definitions);
      }
      if (refProperty.$ref && refProperty.originalRef) {
        refProperty.ref = definitions[refProperty.originalRef];
        refProperty.propertiesList = Object.values(ref.properties || {});
      }
    });
  }
  return ref;
}

function buildApiProperty(parameter: OpenAPIV2.Parameters[number], definitions: OpenAPIV2.DefinitionsObject) {
  if (!('name' in parameter)) return undefined;
  const apiProperty: APIProperty = { ...parameter };
  if (parameter?.schema?.originalRef && parameter?.schema.$ref) {
    const ref = buildRefProperty(definitions[parameter?.schema?.originalRef], definitions);
    apiProperty.ref = ref;
  }
  return apiProperty;
}

function buildApiProperties(
  parameters?: OpenAPIV2.Parameters | undefined,
  definitions?: OpenAPIV2.DefinitionsObject
): APIProperty[] {
  if (!parameters || !definitions) return [];
  const apiProperties: APIProperty[] = [];
  parameters.forEach((parameter) => {
    if (!('name' in parameter)) return;
    const apiProperty = buildApiProperty(parameter, definitions);
    if (apiProperty) {
      apiProperties.push(apiProperty);
    }
  });
  return apiProperties;
}

export function APIListItem({ data, definitions }: APIListItemProps) {
  const { module } = useParams<{ module: string }>();
  const { toast } = useToast();

  const parameters = useMemo<APIProperty[]>(() => {
    const build = buildApiProperties(data.parameters, definitions);
    return sortBy(build, 'in');
  }, [data.parameters, definitions]);

  function handleCopyURL() {
    try {
      const copyPath = `\`/${module}${data.path.replace('{organizationId}', '${getCurrentOrganizationId()}')}\``;
      copy(copyPath);
      toast({
        title: '可以的，复制成功了',
        description: '检查下剪贴板吧。',
      });
    } catch {
      toast({
        title: '复制失败了',
        description: '也许有点兼容性问题。',
        variant: 'destructive',
      });
    }
  }

  function handleGenerateDTS(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    console.log(parameters);
  }

  return (
    <AccordionItem value={data.operationId || ''}>
      <AccordionTrigger className='px-2'>
        <h2 className=''>
          <span className='inline-block  text-left'>
            <Badge
              className='mr-2 uppercase'
              variant='outline'>
              {data.method}
            </Badge>
          </span>
          <span>{data.summary} </span>
          <span> {data.path}</span>
        </h2>
      </AccordionTrigger>
      <AccordionContent>
        <div className='text-left'>
          <div className='flex pl-1 py-1 mb-2'>
            <Button
              variant='link'
              size='sm'
              onClick={handleCopyURL}>
              <Icon
                className='w-5 h-5 mr-1'
                icon='material-symbols:attachment'
              />
              复制请求链接
            </Button>
            <Button
              variant='link'
              size='sm'>
              <Icon
                className='w-5 h-5 mr-1'
                icon='mdi:language-typescript'
              />
              获取 Request DTS
            </Button>
            <Dialog>
              <DialogTrigger onClick={handleGenerateDTS}>
                <Button
                  variant='link'
                  size='sm'>
                  <Icon
                    className='w-5 h-5 mr-1'
                    icon='mdi:language-typescript'
                  />
                  获取 Response DTS
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>{data.summary} DTS</DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className='space-y-8'>
            <Params
              title='Request Parameters'
              data={parameters}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
