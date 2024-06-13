import React, { useCallback, useEffect, useState } from 'react';

import { catppuccinLatte } from '~/lib/theme';

import { Editor, useMonaco } from '@monaco-editor/react';
import { shikiToMonaco } from '@shikijs/monaco';
import { type ThemeInput, getHighlighter } from 'shiki';

export const Encode = () => {
  const monaco = useMonaco();
  const [mounted, setMounted] = useState<boolean>(false);

  const onMount = useCallback(async () => {
    setMounted(false);
    const highlighter = await getHighlighter({
      themes: [catppuccinLatte as unknown as ThemeInput],
      langs: ['json', 'json5'],
    });
    if (monaco) {
      monaco.languages.register({ id: 'json' });
      // @ts-expect-error - `monaco` is defined
      shikiToMonaco(highlighter, monaco);
    }
    setMounted(true);
  }, [monaco]);

  useEffect(() => {
    if (mounted) {
      void onMount();
    }
  }, [mounted, onMount]);

  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-xl font-semibold text-neutral-700'>
        Encode JSON Data
      </h2>
      <div className='rounded-lg bg-[#EFF1F5] p-2'>
        <Editor
          defaultLanguage='json'
          defaultValue='{}'
          height='500px'
          theme='catppuccin-latte'
          options={{
            fontSize: 16,
            lineNumbers: 'off',
          }}
          onMount={async () => {
            await onMount();
          }}
        />
      </div>
    </div>
  );
};
