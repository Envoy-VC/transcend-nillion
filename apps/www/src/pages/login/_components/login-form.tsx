import React, { useState } from 'react';

import { useNillion } from '~/lib/hooks';

import { useStep } from 'usehooks-ts';
import { ConnectNillion } from '~/components';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

import NillionBG from '../../../../public/nillion-bg.png';
import { BiometricAuthStep } from './biometric-auth';

import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

enum LoginSteps {
  ConnectAccount = 1,
  BiometricAuth,
  DatabaseAddress,
}

export const LoginForm = () => {
  const [currentStep, actions] = useStep(3);
  return (
    <div className='flex flex-col gap-2'>
      {currentStep === 1 && (
        <ConnectAccountStep actions={actions} step={currentStep} />
      )}
      {currentStep === 2 && (
        <BiometricAuthStep actions={actions} step={currentStep} />
      )}
      {currentStep === 3 && (
        <DatabaseAddressStep actions={actions} step={currentStep} />
      )}
    </div>
  );
};

export interface StepComponentProps {
  step: LoginSteps;
  actions: ReturnType<typeof useStep>[1];
}

const ConnectAccountStep = ({ actions }: StepComponentProps) => {
  const { userKey } = useNillion();
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col gap-4'>
        <div className='mx-auto max-w-sm text-center text-xl font-semibold text-neutral-700'>
          Connect your Nillion Account to Import a Vault.
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

      <Button disabled={!userKey} onClick={() => actions.goToNextStep()}>
        Next
        <ArrowRightIcon className='ml-2 h-4 w-4' />
      </Button>
    </div>
  );
};

const DatabaseAddressStep = ({ actions }: StepComponentProps) => {
  const [address, setAddress] = useState<string>('');
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col gap-4'>
        <div className='mx-auto max-w-sm pb-8 text-center text-xl font-semibold text-neutral-700'>
          Enter the Database Address of the Vault you want to Import.
        </div>
        <Input
          placeholder='Database Address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className='flex flex-row items-center gap-2'>
        <Button
          className='w-full'
          variant='outline'
          onClick={() => {
            actions.goToPrevStep();
          }}
        >
          <ArrowLeftIcon className='mr-2 h-4 w-4' />
          Back
        </Button>
        <Button className='w-full'>
          Import
          <ArrowRightIcon className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};
