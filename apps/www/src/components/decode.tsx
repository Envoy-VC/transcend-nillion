import React, { useCallback, useEffect, useState } from 'react';

import { catppuccinLatte } from '~/lib/theme';

import { Editor, useMonaco } from '@monaco-editor/react';
import { shikiToMonaco } from '@shikijs/monaco';
import base from 'base-x';
import { type ThemeInput, getHighlighter } from 'shiki';

import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

const base58 = base(
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
);

export const Decode = () => {
  const monaco = useMonaco();
  const [mounted, setMounted] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [decoded, setDecoded] = useState<string | null>(null);

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
      <div className='flex w-full flex-row items-center justify-between'>
        <h2 className='text-xl font-semibold text-neutral-700'>
          Decode JSON Data
        </h2>
        <Button
          onClick={() => {
            const decoded = base58.decode(value);
            setDecoded(
              JSON.stringify(
                JSON.parse(Buffer.from(decoded).toString('utf-8')),
                null,
                2
              )
            );
          }}
        >
          Decode
        </Button>
      </div>
      <Textarea
        placeholder='Enter base58 encoded data...'
        rows={3}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      {decoded ? (
        <div className='rounded-lg bg-[#EFF1F5] p-2'>
          <Editor
            defaultLanguage='json'
            height='256px'
            theme='catppuccin-latte'
            value={decoded}
            options={{
              readOnly: true,
              fontSize: 16,
              lineNumbers: 'off',
            }}
            onMount={async () => {
              await onMount();
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
