'use client';

import React from 'react';

import {
  useBiometricAuth,
  useLibp2p,
  useNillion,
  // useOrbitDB,
} from '~/lib/hooks';
import { storeDescriptor } from '~/lib/nillion/store';
import { useCreateVaultStore } from '~/lib/stores';
import { errorHandler } from '~/lib/utils';

import { toast } from 'sonner';

import { Button } from '~/components/ui/button';

import { ArrowLeftIcon } from 'lucide-react';

export const FinalizeStep = () => {
  const { nillion, client } = useNillion();
  const { node } = useLibp2p();
  const { goToPreviousStep, descriptors, peers } = useCreateVaultStore();
  const { setDescriptor } = useBiometricAuth();
  // const { createDatabase } = useOrbitDB();

  const onCreate = async () => {
    const id = toast.loading('Creating vault...');
    try {
      if (!nillion || !client || !node) {
        throw new Error('Nillion not initialized');
      }
      if (!descriptors) {
        throw new Error('No Face Scan Data Found');
      }

      console.log(client);
      // TODO: Store to Nillion
      const storeID = await storeDescriptor(nillion, client, descriptors);
      setDescriptor(storeID);
      console.log('Stored Descriptor:', storeID);

      // TODO: Create OrbitDB Database Instance
      const vaultPeers = [
        ...node.peerId.toString(),
        ...peers.map((p) => p.id.toString()),
      ];
      // const dbAddress = await createDatabase(vaultPeers);
      // console.log('Database Address:', dbAddress);
      toast.success('Vault created successfully', { id });
    } catch (error) {
      console.log(error);
      toast.error(errorHandler(error), { id });
    }
  };
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
        <Button className='w-full' onClick={onCreate}>
          Create Vault
        </Button>
      </div>
    </div>
  );
};
