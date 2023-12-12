'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { codeToHtml, StringLiteralUnion } from 'shikiji';


const themeConfig: Record<string, StringLiteralUnion<string>> = {
  light: 'vitesse-light',
  dark: 'vitesse-dark',
};

export function Code({ code }: { code: string }) {
  const [highlightCode, setHighlightCode] = useState('');
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    async function init() {
      const result = await codeToHtml(code, {
        lang: 'ts',
        theme: resolvedTheme === 'light' ? themeConfig.light : themeConfig.dark,
      });
      setHighlightCode(result);
    }
    init();
  }, [code, resolvedTheme]);

  return <div dangerouslySetInnerHTML={{ __html: highlightCode }}></div>;
}
