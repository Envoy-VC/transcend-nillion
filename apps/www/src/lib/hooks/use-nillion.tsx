'use client';

import type * as n from '@nillion/nillion-client-js-browser';

import { toast } from 'sonner';
import { create } from 'zustand';

import { getNillionClient } from '../nillion';
import { errorHandler } from '../utils';
import { useSnaps } from './use-snaps';

interface NillionStore {
  userKey: string | null;
  isConnected: boolean;
  client: n.NillionClient | null;
  nillion: typeof n | null;
  setUserKey: (userKey: string) => void;
  setIsConnected: (isConnected: boolean) => void;
  setClient: (client: n.NillionClient) => void;
  setNillion: (nillion: typeof n) => void;
}

export const useNillionStore = create<NillionStore>((set) => ({
  userKey: null,
  isConnected: false,
  client: null,
  nillion: null,
  setUserKey: (userKey: string) => set({ userKey }),
  setIsConnected: (isConnected: boolean) => set({ isConnected }),
  setClient: (client: n.NillionClient) => set({ client }),
  setNillion: (nillion: typeof n) => set({ nillion }),
}));

export const useNillion = () => {
  const { requestSnaps, invokeSnap } = useSnaps();
  const {
    userKey,
    isConnected,
    client,
    nillion,
    setUserKey,
    setIsConnected,
    setClient,
    setNillion,
  } = useNillionStore();

  const connectToNillion = async () => {
    try {
      const nillionSnapId = 'npm:nillion-user-key-manager';
      const snap = await requestSnaps({ [nillionSnapId]: {} });
      if (!snap[nillionSnapId]) {
        throw new Error('Nillion snap not found');
      }

      if (snap[nillionSnapId].blocked) {
        throw new Error('Nillion snap is blocked');
      }

      const response = (await invokeSnap({
        snapId: nillionSnapId,
        request: { method: 'read_user_key' },
      })) as { user_key: string };
      setUserKey(response.user_key);
      const res = await getNillionClient(response.user_key);
      setClient(res.client);
      setNillion(res.nillion);
      setIsConnected(true);
    } catch (error) {
      const message = errorHandler(error);
      toast.error(message);
    }
  };
  return { userKey, isConnected, client, nillion, connectToNillion };
};
