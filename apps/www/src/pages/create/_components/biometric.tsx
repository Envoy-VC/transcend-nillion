'use client';

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

import { useBiometricAuth } from '~/lib/hooks';
import { useCreateVaultStore } from '~/lib/stores';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';

import { ArrowLeftIcon, ArrowRightIcon, ScanFace } from 'lucide-react';

export const BiometricDetails = () => {
  const { goToNextStep, goToPreviousStep, descriptors, setDescriptors } =
    useCreateVaultStore();
  const { getDescriptors } = useBiometricAuth();
  const webcamRef = useRef<Webcam>(null);

  const [isScanning, setIsScanning] = useState<boolean>(false);

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      const screenshot = webcamRef.current?.getScreenshot();
      if (!screenshot) {
        throw new Error('Failed to Capture Face');
      }
      const res = await getDescriptors(screenshot);
      console.log(res);
      setDescriptors(res);
      setIsScanning(false);
      return descriptors;
    },
  });

  return (
    <div className='flex flex-col gap-4'>
      <div className='mx-auto max-w-sm pt-4 text-center text-xl font-semibold text-neutral-700'>
        Secure you Vault with a Biometric Face Scan
      </div>
      <div className='mx-auto my-5 flex h-[20rem] w-[20rem] items-center justify-center rounded-full bg-[#EDF6FF] p-3 shadow-xl shadow-[#CAE4FF]'>
        {isScanning ? (
          <Webcam
            ref={webcamRef}
            className='aspect-square w-[16rem] rounded-full'
            videoConstraints={{ aspectRatio: 1 }}
          />
        ) : (
          <div className='flex h-[17rem] w-[17rem] items-center justify-center rounded-full bg-[#CAE4FF] p-3'>
            <div className='mx-auto flex h-[14rem] w-full max-w-[14rem] items-center justify-center rounded-full bg-[#4D7CFE]'>
              <ScanFace className='h-16 w-16 text-neutral-200' />
            </div>
          </div>
        )}
      </div>
      {isScanning ? (
        <Button
          className='mx-auto my-3 w-full max-w-[10rem] bg-[#4D7CFE]'
          onClick={async () => {
            const id = toast.loading('Scanning Face...');
            try {
              await mutateAsync();
              toast.success('Face Captured Successfully', { id });
            } catch (error) {
              toast.error('Failed to Capture Face', { id });
            }
          }}
        >
          Capture Face
        </Button>
      ) : (
        <Button
          className='mx-auto my-3 w-full max-w-[10rem] bg-[#4D7CFE]'
          onClick={() => setIsScanning(true)}
        >
          Scan
        </Button>
      )}
      <div className='flex w-full flex-row items-center gap-4'>
        <Button className='w-full' variant='outline' onClick={goToPreviousStep}>
          <ArrowLeftIcon className='mr-2 h-4 w-4' />
          Back
        </Button>
        <Button
          className='w-full'
          disabled={!descriptors}
          onClick={goToNextStep}
        >
          Next
          <ArrowRightIcon className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};