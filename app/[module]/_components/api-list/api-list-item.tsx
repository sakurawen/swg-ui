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
import { useMemo, useState } from 'react';
import { APIParameterList } from './api-list-item-parameters';
import { APIParameter } from './typing';
import { buildRequest } from './utils/schema/request';
import { buildResponse } from './utils/schema/response';
import Code from './code';
import { buildDTS } from './utils/schema/format';
import { ScrollArea } from '@/components/ui/scroll-area';

export type APIListItemProps = {
  data: CustomOperationObject;
  definitions: OpenAPIV2.Document['definitions'];
};

export function APIListItem({ data, definitions }: APIListItemProps) {
  const { module } = useParams<{ module: string }>();
  const { toast } = useToast();

  const requestParameters = useMemo<APIParameter[]>(() => {
    if (!data.parameters || !definitions) return [];
    const test = buildRequest(data.parameters, definitions);
    return sortBy(test, 'in');
  }, [data.parameters, definitions]);

  const responseParameters = useMemo<APIParameter[]>(() => {
    const response = buildResponse(data.method, data.path, data.responses, definitions);
    return response;
  }, [data.method, data.path, data.responses, definitions]);

  function handleCopyURL() {
    try {
      const copyPath = `\`/${module}${data.path
        .replace('{organizationId}', '{getCurrentOrganizationId()}')
        .replace(/\{([^\}]+)\}/g, (value) => {
          return `$${value}`;
        })}\``;
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
  const [code, setCode] = useState('');

  function handleGenerateRequestDTS(e: React.MouseEvent) {
    const code = buildDTS(requestParameters, definitions);
    setCode(code);
    console.log({ data, requestParameters, definitions, code });
  }

  function handleGenerateResponseDTS(e: React.MouseEvent) {
    const code = buildDTS(responseParameters, definitions);
    setCode(code);
    console.log({ data, responseParameters, definitions, code });
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
            {requestParameters.length >= 200 ? null : (
              <Dialog
                onOpenChange={(open) => {
                  if (!open) setCode('');
                }}>
                <DialogTrigger>
                  <Button
                    className='cursor-default'
                    variant='link'
                    size='sm'
                    onClick={handleGenerateRequestDTS}>
                    <Icon
                      className='w-5 h-5 mr-1'
                      icon='mdi:language-typescript'
                    />
                    获取 Request Types
                  </Button>
                </DialogTrigger>
                <DialogContent className='max-w-4xl '>
                  <DialogHeader className='text-2xl font-bold'>{data.summary} Request Types</DialogHeader>
                  <ScrollArea className='max-h-[60vh] border rounded-lg shadow-sm'>
                    <Code code={code} />
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            )}
            <Dialog
              onOpenChange={(open) => {
                if (!open) setCode('');
              }}>
              <DialogTrigger onClick={handleGenerateResponseDTS}>
                <Button
                  className='cursor-default'
                  variant='link'
                  size='sm'>
                  <Icon
                    className='w-5 h-5 mr-1'
                    icon='mdi:language-typescript'
                  />
                  获取 Response Types
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-4xl '>
                <DialogHeader className='text-2xl font-bold'>{data.summary} Response Types</DialogHeader>
                <ScrollArea className='max-h-[60vh] border rounded-lg shadow-sm'>
                  <Code code={code} />
                </ScrollArea>
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
                  firstLayer
                />
              </TabsContent>
              <TabsContent value='response'>
                <APIParameterList
                  data={responseParameters}
                  definitions={definitions}
                  firstLayer
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
