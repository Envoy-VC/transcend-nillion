'use client';

/* eslint-disable @next/next/no-img-element -- custom image for avatar */
import React from 'react';

import { truncate } from '~/lib/utils';

import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

import { TextCopy } from './text-copy';

export const ConnectNillion = () => {
  const connected = true;
  const userKey = '77hjnsf7d7tj4nmadasdjehfbajfna9842sdda';
  if (!connected) {
    return <Button className='bg-[#4D7CFE]'>Connect to Nillion</Button>;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          className='h-12 w-full justify-start rounded-xl'
          variant='outline'
        >
          <div className='flex flex-row items-center gap-3'>
            <img
              alt=''
              className='h-9 w-9 rounded-full'
              src={`https://api.dicebear.com/8.x/shapes/svg?seed=${userKey}`}
            />

            <div className='flex flex-col items-start'>
              <div className='font-semibold'>{truncate(userKey)}</div>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className='flex flex-row items-center'>
          <Tabs className='w-[400px]' defaultValue='details'>
            <TabsList>
              <TabsTrigger value='details'>Details</TabsTrigger>
              <TabsTrigger value='libp2p'>Libp2p Node</TabsTrigger>
            </TabsList>
            <TabsContent className='py-3' value='details'>
              <div className='flex flex-row items-center gap-2'>
                <div className='font-medium'>User ID: </div>
                <TextCopy text={userKey} />
              </div>
              <div className='flex flex-row items-center gap-2'>
                <div className='font-medium'>User Key: </div>
                <TextCopy text={userKey} type='password' />
              </div>
            </TabsContent>
            <TabsContent value='libp2p'>Change your password here.</TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
