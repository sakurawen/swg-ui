'use client';
import { CustomOperationObject } from '@/app/typing';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Icon } from '@iconify/react';
import { copy } from 'clipboard';
import { sortBy } from 'lodash';
import { useParams } from 'next/navigation';
import { OpenAPIV2 } from 'openapi-types';
import { useMemo } from 'react';
import { APIParameterList } from './api-parameters';
import { APIParameter } from './typing';
import { buildRequestParameters } from './utils/request';
import { buildResponseParameters } from './utils/response';

export type APIListItemProps = {
  data: CustomOperationObject;
  definitions: OpenAPIV2.Document['definitions'];
};

export function APIListItem({ data, definitions }: APIListItemProps) {
  const { module } = useParams<{ module: string }>();
  const { toast } = useToast();
  const requestParameters = useMemo<APIParameter[]>(() => {
    const request = buildRequestParameters(data.parameters, definitions);
    return sortBy(request, 'in');
  }, [data.parameters, definitions]);

  const responseParameters = useMemo<APIParameter[]>(() => {
    const response = buildResponseParameters(data.method, data.path, data.responses, definitions);
    return response;
  }, [data.method, data.path, data.responses, definitions]);

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
  function handleGenerateRequestDTS(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    console.log({ data, requestParameters, definitions });
  }

  function handleGenerateResponseDTS(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    console.log({ data, responseParameters, definitions });
  }
  return (
    <AccordionItem value={data.operationId || ''}>
      <AccordionTrigger className='px-2 cursor-default'>
        <h2 className='text-left whitespace-nowrap text-ellipsis mr-1'>
          <Badge
            className='mr-2 uppercase'
            variant='outline'>
            {data.method}
          </Badge>
          <span>{data.summary} </span>
          <span>{data.path}</span>
        </h2>
      </AccordionTrigger>
      <AccordionContent>
        <div className='text-left'>
          <div className='flex pl-1 py-1 mb-2'>
            <Button
              className='cursor-default'
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
              className='cursor-default'
              variant='link'
              size='sm'
              onClick={handleGenerateRequestDTS}>
              <Icon
                className='w-5 h-5 mr-1'
                icon='mdi:language-typescript'
              />
              获取 Request DTS
            </Button>
            <Dialog>
              <DialogTrigger onClick={handleGenerateResponseDTS}>
                <Button
                  className='cursor-default'
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
            <Tabs defaultValue='request'>
              <TabsList className='ml-2 mb-2'>
                <TabsTrigger
                  className='px-6'
                  value='request'>
                  Parameters
                </TabsTrigger>
                <TabsTrigger
                  className='px-6'
                  value='response'>
                  Responses
                </TabsTrigger>
              </TabsList>
              <TabsContent value='request'>
                <APIParameterList
                  data={requestParameters}
                  definitions={definitions}
                />
              </TabsContent>
              <TabsContent value='response'>
                <APIParameterList
                  data={responseParameters}
                  definitions={definitions}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
