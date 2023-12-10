"use client"
import { PropsWithChildren } from "react";
import {SWRConfig} from "swr"


export function SWRConfigProvider({children}:PropsWithChildren){
  return <SWRConfig>
    {children}
  </SWRConfig>
}
