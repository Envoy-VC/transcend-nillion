'use client';

import React from 'react';

import { useNillion } from '~/lib/hooks';

import { ed25519 } from '@noble/curves/ed25519';
import baseX from 'base-x';

import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

import { TextCopy } from './text-copy';

export const ConnectNillion = () => {
  const base58 = baseX(
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  );
  const { userKey, isConnected, connectToNillion } = useNillion();
  if (!isConnected || !userKey) {
    return (
      <Button className='bg-[#4D7CFE] text-white' onClick={connectToNillion}>
        Connect to Nillion
      </Button>
    );
  }

  // const privateKey = Buffer.from(base58.decode(userKey).subarray(32)).toString(
  //   'hex'
  // );
  // const pubKey = Buffer.from(ed25519.getPublicKey(privateKey)).toString('hex');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className='w-full bg-[#4D7CFE] text-white'
          onClick={connectToNillion}
        >
          Connected to Nillion
        </Button>
      </DialogTrigger>
      <DialogContent className='w-full max-w-xl'>
        <div className='flex flex-row items-center'>
          <Tabs className='w-[400px]' defaultValue='details'>
            <TabsList>
              <TabsTrigger value='details'>Details</TabsTrigger>
              <TabsTrigger value='libp2p'>Libp2p Node</TabsTrigger>
            </TabsList>
            <TabsContent className='py-3' value='details'>
              {/* <div className='flex flex-row items-center gap-2'>
                <div className='font-medium'>User ID: </div>
                <TextCopy text={pubKey} />
              </div>
              <div className='flex flex-row items-center gap-2'>
                <div className='font-medium'>User Key: </div>
                <TextCopy text={userKey} type='password' />
              </div>
              <div className='flex flex-row items-center gap-2'>
                <div className='font-medium'>Private Key: </div>
                <TextCopy text={privateKey} type='password' />
              </div> */}
            </TabsContent>
            <TabsContent value='libp2p'>Change your password here.</TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
