'use client';

import type { PropsWithChildren } from 'react';

import { useLibp2p } from '~/lib/hooks';

export const Libp2pProvider = ({ children }: PropsWithChildren) => {
  useLibp2p();
  return children;
};
