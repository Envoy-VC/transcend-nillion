'use client';

import React from 'react';

import { useCreateVaultStore } from '~/lib/stores';

import { Button } from '~/components/ui/button';

import { ArrowRightIcon } from 'lucide-react';

export const ConnectAccount = () => {
  const { goToNextStep } = useCreateVaultStore();
  return (
    <div className='flex h-full flex-col justify-between gap-4'>
      <div className='flex flex-col gap-4'>
        <div className='mx-auto max-w-sm text-center text-xl font-semibold text-neutral-700'>
          Connect your Nillion Account to create a Vault.
        </div>
        <Button className='bg-[#4D7CFE]'>Connect to Nillion</Button>
      </div>

      <Button onClick={goToNextStep}>
        Next
        <ArrowRightIcon className='ml-2 h-4 w-4' />
      </Button>
    </div>
  );
};
