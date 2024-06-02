'use client';

import React from 'react';

import { CreateVaultSteps, useCreateVaultSteps } from '~/lib/stores';

import { BiometricDetails, Box, ConnectAccount, SlideIn } from './_components';

const CreateVault = () => {
  const { currentStep } = useCreateVaultSteps();

  return (
    <div className='flex h-screen w-full items-start justify-center py-24'>
      <Box>
        {currentStep === CreateVaultSteps.ConnectAccount && (
          <SlideIn>
            <ConnectAccount />
          </SlideIn>
        )}
        {currentStep === CreateVaultSteps.CreateBiometricScan && (
          <SlideIn>
            <BiometricDetails />
          </SlideIn>
        )}
      </Box>
    </div>
  );
};

export default CreateVault;
