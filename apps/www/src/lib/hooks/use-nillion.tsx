import { toast } from 'sonner';
import { create } from 'zustand';

import { errorHandler } from '../utils';
import { useSnaps } from './use-snaps';

interface NillionStore {
  userKey: string | null;
  isConnected: boolean;
  setUserKey: (userKey: string) => void;
  setIsConnected: (isConnected: boolean) => void;
}

export const useNillionStore = create<NillionStore>((set) => ({
  userKey: null,
  isConnected: false,
  setUserKey: (userKey: string) => set({ userKey }),
  setIsConnected: (isConnected: boolean) => set({ isConnected }),
}));

export const useNillion = () => {
  const { requestSnaps, invokeSnap } = useSnaps();
  const { userKey, isConnected, setUserKey, setIsConnected } =
    useNillionStore();

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

      const res = (await invokeSnap({
        snapId: nillionSnapId,
        request: { method: 'read_user_key' },
      })) as { user_key: string };

      setUserKey(res.user_key);
      setIsConnected(true);
    } catch (error) {
      const message = errorHandler(error);
      toast.error(message);
    }
  };
  return { userKey, isConnected, connectToNillion };
};
