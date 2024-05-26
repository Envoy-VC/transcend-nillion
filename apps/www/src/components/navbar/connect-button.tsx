'use client';

import React from 'react';

import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import { BigNumber } from 'bignumber.js';
import {
  useAccount,
  useBalance,
  useChains,
  useEnsAvatar,
  useEnsName,
} from 'wagmi';

import { Button } from '~/components/ui/button';

import { Skeleton } from '../ui/skeleton';

/* eslint-disable @next/next/no-img-element -- ENS Avatar can have any remote pattern */

export const ConnectButton = () => {
  const { address } = useAccount();
  const chains = useChains();

  const { open } = useWeb3Modal();
  const { open: isOpen, selectedNetworkId } = useWeb3ModalState();

  // Balance
  const { data: balance, status: balanceStatus } = useBalance({
    address,
  });

  // ENS
  const { data: ensName, status: ensNameStatus } = useEnsName({
    address,
  });
  const { data: ensAvatar, status: ensAvatarStatus } = useEnsAvatar({
    name: ensName ?? '',
    query: {
      enabled: ensName !== null,
      initialData: `https://api.dicebear.com/8.x/shapes/svg?seed=${address ?? ''}`,
    },
  });

  const chainIds = chains.map((c) => c.id);
  const activeChainId = parseInt(selectedNetworkId ?? '1');
  const currencySymbol =
    chains.find((c) => c.id === activeChainId)?.nativeCurrency.symbol ?? '';

  const formattedBalance = (() => {
    if (balanceStatus === 'success') {
      return BigNumber(Number(balance.value))
        .dividedBy(10 ** balance.decimals)
        .toFixed(4);
    }
    return '';
  })();

  const formattedAddress = (() => {
    if (address) {
      return `${address.slice(0, 4)}...${address.slice(-3)}`;
    }
    return '';
  })();

  if (!address) {
    return (
      <Button
        className='rounded-full'
        onClick={() =>
          open({
            view: 'Connect',
          })
        }
      >
        {isOpen ? 'Connecting...' : 'Connect'}
      </Button>
    );
  } else if (!chainIds.includes(activeChainId)) {
    return (
      <Button
        className='rounded-full'
        onClick={() =>
          open({
            view: 'Networks',
          })
        }
      >
        Switch Network
      </Button>
    );
  } else if (chainIds.includes(activeChainId)) {
    return (
      <Button
        className='h-12 rounded-xl'
        variant='outline'
        onClick={() =>
          open({
            view: 'Account',
          })
        }
      >
        <div className='flex flex-row items-center gap-3'>
          {ensAvatarStatus === 'pending' ? (
            <Skeleton className='h-9 w-9 rounded-full' />
          ) : (
            <img
              alt=''
              className='h-9 w-9 rounded-full'
              src={
                ensAvatar ??
                `https://api.dicebear.com/8.x/shapes/svg?seed=${address}`
              }
            />
          )}
          <div className='flex flex-col items-start'>
            <div className='font-semibold'>
              {ensNameStatus === 'success' ? (
                ensName ?? formattedAddress
              ) : (
                <Skeleton className='h-4 w-24' />
              )}
            </div>
            <div className='text-xs font-medium text-neutral-600'>
              {balanceStatus === 'success' ? (
                <>
                  {formattedBalance} {currencySymbol}
                </>
              ) : (
                <Skeleton className='h-3 w-16 pt-[2px]' />
              )}
            </div>
          </div>
        </div>
      </Button>
    );
  }
};
