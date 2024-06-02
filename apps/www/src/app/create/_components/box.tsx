'use client';

import Image from 'next/image';

import React, { type PropsWithChildren } from 'react';

import Logo from 'public/logo.svg';
import { ResizablePanel } from '~/components';

export const Box = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex w-full max-w-xl flex-col items-center justify-center gap-4'>
      <div className='flex w-full flex-row items-center justify-center gap-2'>
        <Image alt='logo' className='h-8 w-8' src={Logo as unknown as string} />
        <h1 className='text-2xl font-medium'>TRANSCEND</h1>
      </div>
      <div className='mx-auto h-auto w-full'>
        <ResizablePanel>
          <div className='flex w-full flex-col rounded-2xl p-4'>{children}</div>
        </ResizablePanel>
      </div>
    </div>
  );
};
