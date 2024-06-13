import type { PropsWithChildren } from 'react';

import { useBiometricAuth, useLibp2p ,useOrbitDB} from '~/lib/hooks';

export const Libp2pProvider = ({ children }: PropsWithChildren) => {
  useLibp2p();
  useOrbitDB();
  useBiometricAuth();
  return children;
};
