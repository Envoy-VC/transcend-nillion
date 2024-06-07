import React from 'react';

import { useNillion } from '~/lib/hooks';
import { useCreateVaultStore } from '~/lib/stores';

import NillionBG from '../../../../public/nillion-bg.png';
import { ConnectNillion } from '~/components';

import { Button } from '~/components/ui/button';

import { ArrowRightIcon } from 'lucide-react';

export const ConnectAccount = () => {
  const { userKey } = useNillion();
  const { goToNextStep } = useCreateVaultStore();
  return (
    <div className='flex h-full flex-col justify-between gap-4'>
      <div className='flex flex-col gap-4'>
        <div className='mx-auto max-w-sm text-center text-xl font-semibold text-neutral-700'>
          Connect your Nillion Account to create a Vault.
        </div>
        <img
          alt='Nillion'
          className='mx-auto'
          height={400}
          src={NillionBG}
          width={1000}
        />
        <ConnectNillion />
      </div>

      <Button disabled={!userKey} onClick={goToNextStep}>
        Next
        <ArrowRightIcon className='ml-2 h-4 w-4' />
      </Button>
    </div>
  );
};