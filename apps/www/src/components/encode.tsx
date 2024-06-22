import React, { useCallback, useEffect, useState } from 'react';

import { catppuccinLatte } from '~/lib/theme';

import { Editor, useMonaco } from '@monaco-editor/react';
import { shikiToMonaco } from '@shikijs/monaco';
import base from 'base-x';
import { type ThemeInput, getHighlighter } from 'shiki';

import { TextCopy } from './text-copy';
import { Button } from './ui/button';

const base58 = base(
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
);

const defaultJSON = `
{
  "name": "John Doe"
}
`;
export const Encode = () => {
  const monaco = useMonaco();
  const [mounted, setMounted] = useState<boolean>(false);
  const [value, setValue] = useState<string>(defaultJSON);
  const [encoded, setEncoded] = useState<string>('');

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
          Encode JSON Data
        </h2>
        <Button
          onClick={() => {
            const encoded = base58.encode(
              Buffer.from(JSON.stringify(JSON.parse(value)))
            );
            setEncoded(encoded);
          }}
        >
          Encode
        </Button>
      </div>
      <div className='rounded-lg bg-[#EFF1F5] p-2'>
        <Editor
          defaultLanguage='json'
          height='500px'
          theme='catppuccin-latte'
          value={value}
          options={{
            fontSize: 16,
            lineNumbers: 'off',
          }}
          onChange={(value) => {
            setValue(value ?? '');
          }}
          onMount={async () => {
            await onMount();
          }}
        />
      </div>

      {encoded ? (
        <div className='flex flex-row items-center gap-2'>
          <h3 className='text-base font-medium text-neutral-700'>
            Encoded Data:
          </h3>
          <TextCopy enableTruncate={false} text={encoded} />
        </div>
      ) : null}
    </div>
  );
};