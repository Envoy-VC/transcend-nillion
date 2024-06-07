'use client';

import type { PropsWithChildren } from 'react';

import { useBiometricAuth, useLibp2p } from '~/lib/hooks';

export const Libp2pProvider = ({ children }: PropsWithChildren) => {
  useLibp2p();
  // useOrbitDB();
  useBiometricAuth();
  return children;
};
