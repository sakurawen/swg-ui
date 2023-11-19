'use client';
import { Badge as RadixBadge, type badgePropDefs } from '@radix-ui/themes';
import { OpenAPIV2 } from 'openapi-types';

type BadgeProps = {
  type: OpenAPIV2.HttpMethods;
};

const typeColorMap = {
  [OpenAPIV2.HttpMethods.GET]: 'blue',
  [OpenAPIV2.HttpMethods.POST]: 'amber',
  [OpenAPIV2.HttpMethods.PUT]: 'orange',
  [OpenAPIV2.HttpMethods.DELETE]: 'red',
  [OpenAPIV2.HttpMethods.PATCH]: 'sky',
} as Record<OpenAPIV2.HttpMethods, (typeof badgePropDefs)['color']['values'][number]>;

export function Badge({ type }: BadgeProps) {
  return <RadixBadge mr="2" variant='surface' color={typeColorMap[type]} className='uppercase '>{type}</RadixBadge>;
}
