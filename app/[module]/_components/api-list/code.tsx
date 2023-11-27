import { useMemo } from 'react';
import { highlight } from 'sugar-high';

export default function Code({ code }: { code: string }) {
  const highlightCode = useMemo(() => {
    return highlight(code);
  }, [code]);
  return (
    <div>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: highlightCode }}></code>
      </pre>
    </div>
  );
}
