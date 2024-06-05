'use client';

import Image from 'next/image';

import React from 'react';

import { useLibp2p, useNillion } from '~/lib/hooks';
import { useCreateVaultStore } from '~/lib/stores';

import { Button } from '~/components/ui/button';

import { ArrowLeftIcon } from 'lucide-react';

export const FinalizeStep = () => {
  const { userKey } = useNillion();
  const { node } = useLibp2p();
  const { goToPreviousStep, descriptors, peers } = useCreateVaultStore();
  return (
    <div className='flex h-full flex-col justify-between gap-4'>
      <div className='flex flex-col gap-4'>
        <div className='mx-auto max-w-sm text-center text-xl font-semibold text-neutral-700'>
          Finalize your vault creation options.
        </div>
      </div>
      
      <div className='flex flex-row gap-2'>
        <Button className='w-full' variant='outline' onClick={goToPreviousStep}>
          <ArrowLeftIcon className='mr-2 h-4 w-4' />
          Back
        </Button>
        <Button>Create Vault</Button>
      </div>
    </div>
  );
};
