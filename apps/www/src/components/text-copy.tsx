/* eslint-disable no-nested-ternary -- allow nested */
import React, { useEffect, useState } from 'react';

import { truncate } from '~/lib/utils';

import { toast } from 'sonner';
import { useCopyToClipboard } from 'usehooks-ts';

import { Button } from './ui/button';

import { CircleCheck, CopyIcon, Eye, EyeOff } from 'lucide-react';

interface TextCopyProps {
  text: string | null;
  type?: 'text' | 'password';
  enableTruncate?: boolean;
  canCopy?: boolean;
  enableToast?: boolean;
}

export const TextCopy = ({
  text,
  type = 'text',
  enableTruncate = true,
  canCopy = true,
  enableToast = false,
}: TextCopyProps) => {
  const [, copy] = useCopyToClipboard();

  const [copied, setCopied] = useState<boolean>(false);
  const [hidden, setHidden] = useState(type === 'password');

  const copyText = async () => {
    try {
      if (!text) throw new Error('No text to copy');
      await copy(text);
      if (enableToast) toast.success('Copied to clipboard');
      setCopied(true);
    } catch (error) {
      let errorMessage: string;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string'
      ) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An error occurred';
      }
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (copied) {
      const id = setTimeout(() => {
        setCopied(false);
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [copied]);
  if (text)
    return (
      <div className='flex flex-row items-center gap-2'>
        <div className='font-semibold'>
          {type === 'text'
            ? enableTruncate
              ? truncate(text)
              : text
            : hidden
              ? '*'.repeat(24)
              : enableTruncate
                ? truncate(text)
                : text}
        </div>
        {type === 'password' && (
          <Button
            className='h-8 w-8 p-0'
            variant='ghost'
            onClick={() => setHidden((prev) => !prev)}
          >
            {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        )}
        {canCopy ? (
          <Button className='h-8 w-8 p-0' variant='ghost' onClick={copyText}>
            {copied ? <CircleCheck size={18} /> : <CopyIcon size={16} />}
          </Button>
        ) : null}
      </div>
    );
  return null;
};
