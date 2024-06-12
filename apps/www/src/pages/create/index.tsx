'use client';

import React from 'react';

import { CreateVaultSteps, useCreateVaultStore } from '~/lib/stores';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '~/components/ui/carousel';

import { Box, ConnectAccount, FinalizeStep, SelectPeers } from './_components';

export const CreatePage = () => {
  const { setApi } = useCreateVaultStore();

  return (
    <div className='flex h-screen w-full items-start justify-center py-24'>
      <Box>
        <Carousel setApi={setApi}>
          <CarouselContent>
            <CarouselItem key={CreateVaultSteps.ConnectAccount}>
              <ConnectAccount />
            </CarouselItem>
            <CarouselItem key={CreateVaultSteps.SelectPeers}>
              <SelectPeers />
            </CarouselItem>
            <CarouselItem key={CreateVaultSteps.Finalize}>
              <FinalizeStep />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </Box>
    </div>
  );
};
