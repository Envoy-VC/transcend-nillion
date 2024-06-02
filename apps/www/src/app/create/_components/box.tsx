'use client';

import Image from 'next/image';

import React, { type PropsWithChildren } from 'react';

import Logo from 'public/logo.svg';

export const Box = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex w-full max-w-xl flex-col items-center justify-center gap-4'>
      <div className='flex w-full flex-row items-center justify-center gap-2'>
        <Image alt='logo' className='h-8 w-8' src={Logo as unknown as string} />
        <h1 className='text-2xl font-medium'>TRANSCEND</h1>
      </div>
      <div className='mx-auto h-auto w-full rounded-3xl p-4 shadow-[rgba(0,0,0,0.05)_0px_6px_24px_0px,rgba(0,0,0,0.08)_0px_0px_0px_1px]'>
        {children}
      </div>
    </div>
  );
};
