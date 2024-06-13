import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLibp2p, useOrbitDB } from '~/lib/hooks';
import { useCreateVaultStore } from '~/lib/stores';
import { errorHandler, truncate } from '~/lib/utils';

import { toast } from 'sonner';
import { TextCopy } from '~/components';

import { Button } from '~/components/ui/button';

import { ArrowLeftIcon } from 'lucide-react';

export const FinalizeStep = () => {
  const { node } = useLibp2p();
  const { goToPreviousStep, peers } = useCreateVaultStore();
  const { createDatabase } = useOrbitDB();
  const navigate = useNavigate();

  const [dbAddress, setDbAddress] = useState<string | null>(null);

  const onCreate = async () => {
    const id = toast.loading('Creating vault...');
    try {
      if (!node) {
        throw new Error('Nillion not initialized');
      }
      const vaultPeers = peers.map((p) => {
        return p.id.toBytes();
      });

      const dbAddress = await createDatabase(vaultPeers);
      setDbAddress(dbAddress);
      toast.success('Vault created successfully', { id });
    } catch (error) {
      console.log(error);
      toast.error(errorHandler(error), { id });
    }
  };
  return (
    <div className='flex h-full flex-col justify-between gap-4'>
      <div className='flex flex-col gap-4'>
        <div className='mx-auto max-w-sm py-4 text-center text-xl font-semibold text-neutral-700'>
          Finalize your vault creation options.
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-1'>
            <div className='text-lg font-semibold text-neutral-600'>Peers</div>
            <div className='flex flex-col gap-2'>
              {peers.map((peer, index) => (
                <div key={index} className='flex flex-row items-center gap-2'>
                  <img
                    crossOrigin='anonymous'
                    src={`https://api.dicebear.com/8.x/shapes/svg?seed=${peer.id.toString()}`}
                    alt='Peer Avatar'
                    className='h-8 w-8 rounded-full'
                  />
                  <div className='text-sm font-semibold text-neutral-700'>
                    {truncate(peer.id.toString())}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {dbAddress ? (
          <div className='flex flex-col gap-2'>
            <div className='text-lg font-semibold text-neutral-600'>
              Vault Address
            </div>
            <div className='flex flex-col gap-2'>
              <div className='text-sm font-semibold text-neutral-700'>
                <TextCopy enableTruncate={false} text={dbAddress} />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className='flex flex-row gap-2'>
        <Button className='w-full' variant='outline' onClick={goToPreviousStep}>
          <ArrowLeftIcon className='mr-2 h-4 w-4' />
          Back
        </Button>
        {dbAddress ? (
          <Button
            className='w-full'
            onClick={() => {
              navigate(`/dashboard`);
            }}
          >
            Go to Vault
          </Button>
        ) : (
          <Button className='w-full' onClick={onCreate}>
            Create Vault
          </Button>
        )}
      </div>
    </div>
  );
};
