'use client';

import React from 'react';

import { CreateVaultSteps, useCreateVaultStore } from '~/lib/stores';

import {
  BiometricDetails,
  Box,
  ConnectAccount,
  SlideIn,
  ThresholdSelect,
} from './_components';

const CreateVault = () => {
  const { currentStep } = useCreateVaultStore();

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
        {currentStep === CreateVaultSteps.ConfigureRootKeys && (
          <SlideIn>
            <ThresholdSelect />
          </SlideIn>
        )}
      </Box>
    </div>
  );
};

export default CreateVault;
