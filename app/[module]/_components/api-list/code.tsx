'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import type { Highlighter, Theme, getHighlighter } from 'shiki';

interface Noting {}
type StringLiteralUnion<T extends U, U = string> = T | (U & Noting);

let highlighter: Highlighter | undefined;

const themeConfig: Record<string, StringLiteralUnion<Theme>> = {
  light: 'vitesse-light',
  dark: 'vitesse-dark',
};

export default function Code({ code }: { code: string }) {
  const [highlightCode, setHighlightCode] = useState('');
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    async function init() {
      if (highlighter === undefined) {
        // @ts-expect-error shiki由cdn引入
        highlighter = await shiki.getHighlighter({
          langs: ['ts'],
          themes: [themeConfig.light, themeConfig.dark],
        });
      }
      // @ts-expect-error shiki由cdn引入
      const result = highlighter.codeToHtml(code, {
        lang: 'ts',
        theme: resolvedTheme === 'light' ? themeConfig.light : themeConfig.dark,
      });
      setHighlightCode(result);
    }
    init();
  }, [code, resolvedTheme]);

  return <div dangerouslySetInnerHTML={{ __html: highlightCode }}></div>;
}
