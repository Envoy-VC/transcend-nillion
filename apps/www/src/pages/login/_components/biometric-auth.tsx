import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

import {
  useBiometricAuth,
  useNillion,
  useOrbitDB,
  useSession,
} from '~/lib/hooks';
import { errorHandler } from '~/lib/utils';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';

import type { StepComponentProps } from './login-form';

import { ArrowLeftIcon, ArrowRightIcon, ScanFace } from 'lucide-react';

export const BiometricAuthStep = ({ actions }: StepComponentProps) => {
  const webcamRef = useRef<Webcam>(null);

  const { storeID, getDescriptors, setStoreID } = useBiometricAuth();
  const { nillion, client, storeDescriptor, compute } = useNillion();
  const { dbAddress } = useOrbitDB();
  const navigate = useNavigate();
  const { saveSession, isValidSession } = useSession();

  const [isScanning, setIsScanning] = useState<boolean>(false);

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      const screenshot = webcamRef.current?.getScreenshot();
      setIsScanning(false);
      if (!screenshot) {
        throw new Error('Failed to Capture Face');
      }
      if (!nillion || !client) {
        throw new Error('Nillion not initialized');
      }
      const descriptors = await getDescriptors(screenshot);
      const expires = Date.now() + 24 * 60 * 60 * 1000;
      if (storeID) {
        // If Store ID exists, then we are verifying the face
        const res = await compute(nillion, client, [storeID], descriptors);
        if (res.match) {
          await saveSession({
            userId: client.user_id,
            storeId: storeID,
            score: res.distance,
            expires,
          });
        } else {
          throw new Error('Face does not match');
        }
      } else {
        // If Store ID does not exist, then we are storing the face
        const id = await storeDescriptor(nillion, client, descriptors);
        setStoreID(id);
        await saveSession({
          userId: client.user_id,
          storeId: id,
          score: 0,
          expires,
        });
      }
    },
  });

  const onNext = async () => {
    const isValid = await isValidSession();
    if (!isValid) {
      toast.error('Session Invalid, Please Login Again');
    }
    if (dbAddress) {
      navigate('/dashboard');
      return;
    }
    actions.goToNextStep();
  };

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
            const id = toast.loading('Capturing Face');
            try {
              await mutateAsync();
              toast.success('Face Captured', { id });
            } catch (error) {
              toast.error(errorHandler(error), { id });
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
        <Button className='w-full' onClick={onNext}>
          Next
          <ArrowRightIcon className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};
