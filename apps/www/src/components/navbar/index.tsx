import Image from 'next/image';

import React from 'react';

import Logo from 'public/logo.svg';

import { ConnectButton } from './connect-button';

export const Navbar = () => {
  return (
    <div className='h-[6dvh] w-full border'>
      <div className='mx-auto flex h-full max-w-screen-xl items-center justify-between px-4'>
        <div className='flex flex-row items-center gap-2'>
          <Image
            alt='Transcend Logo'
            className='h-6 w-6'
            src={Logo as unknown as string}
          />
          <div className='font-semibold'>TRANSCEND</div>
        </div>
        <div className='text-xl font-semibold'>Web3 Starter</div>
        <ConnectButton />
      </div>
    </div>
  );
};
