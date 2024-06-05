'use client';

import React from 'react';

import { CreateVaultSteps, useCreateVaultStore } from '~/lib/stores';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '~/components/ui/carousel';

import {
  BiometricDetails,
  Box,
  ConnectAccount,
  FinalizeStep,
  SelectPeers,
} from './_components';

const CreateVault = () => {
  const { setApi } = useCreateVaultStore();

  return (
    <div className='flex h-screen w-full items-start justify-center py-24'>
      <Box>
        <Carousel setApi={setApi}>
          <CarouselContent>
            <CarouselItem key={CreateVaultSteps.ConnectAccount}>
              <ConnectAccount />
            </CarouselItem>
            <CarouselItem key={CreateVaultSteps.CreateBiometricScan}>
              <BiometricDetails />
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

export default CreateVault;
