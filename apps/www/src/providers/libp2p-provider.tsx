'use client';

import type { PropsWithChildren } from 'react';

import { useLibp2p, useOrbitDB } from '~/lib/hooks';

export const Libp2pProvider = ({ children }: PropsWithChildren) => {
  useLibp2p();
  useOrbitDB();
  return children;
};
