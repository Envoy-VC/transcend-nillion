'use client';

import React from 'react';

import { useLibp2p, useNillion } from '~/lib/hooks';

import { ed25519 } from '@noble/curves/ed25519';
import baseX from 'base-x';

import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

import { TextCopy } from './text-copy';

export const ConnectNillion = () => {
  const { node, connectedPeers } = useLibp2p();
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

  const privateKey = Buffer.from(base58.decode(userKey).subarray(32)).toString(
    'hex'
  );
  const pubKey = Buffer.from(ed25519.getPublicKey(privateKey)).toString('hex');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='bg-[#4D7CFE] text-white'>
          Connected to Nillion
        </Button>
      </DialogTrigger>
      <DialogContent className='w-full max-w-xl'>
        <div className='flex flex-col gap-8'>
          <div className='flex flex-row items-start gap-4'>
            <img
              alt='Peer Avatar'
              className='h-16 w-16 rounded-full'
              crossOrigin='anonymous'
              src={`https://api.dicebear.com/8.x/shapes/svg?seed=${pubKey}`}
            />
            <div className='flex flex-row items-center gap-2'>
              <div className='font-medium'>User ID: </div>
              <TextCopy text={pubKey} />
            </div>
          </div>
          <Tabs className='w-[400px]' defaultValue='details'>
            <TabsList>
              <TabsTrigger value='details'>Details</TabsTrigger>
              <TabsTrigger value='libp2p'>Libp2p Node</TabsTrigger>
            </TabsList>
            <TabsContent className='py-3' value='details'>
              <div className='flex flex-row items-center gap-2'>
                <div className='font-medium'>User Key: </div>
                <TextCopy text={userKey} type='password' />
              </div>
              <div className='flex flex-row items-center gap-2'>
                <div className='font-medium'>Private Key: </div>
                <TextCopy text={privateKey} type='password' />
              </div>
            </TabsContent>
            <TabsContent value='libp2p'>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-row items-center gap-2'>
                  <div className='font-medium'>Peer ID: </div>
                  <TextCopy text={node?.peerId.toString() ?? ''} />
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <div className='font-medium'>Multiaddr: </div>
                  <TextCopy text={node?.getMultiaddrs().join(', ') ?? ''} />
                </div>
                <div className='flex flex-col items-start gap-2'>
                  <div className='font-medium'>Connected Peers: </div>
                  <div className='flex flex-col'>
                    {connectedPeers.map((peer) => (
                      <div
                        key={peer.toString()}
                        className='flex flex-row items-center gap-3'
                      >
                        <img
                          alt='Peer Avatar'
                          className='h-6 w-6 rounded-full'
                          crossOrigin='anonymous'
                          src={`https://api.dicebear.com/8.x/shapes/svg?seed=${peer.toString()}`}
                        />
                        <TextCopy text={peer.toString()} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
