/* eslint-disable @typescript-eslint/no-unsafe-member-access -- snaps api not yet supported */

/* eslint-disable @typescript-eslint/no-unsafe-call -- snaps api not yet supported  */
import { useAccount } from 'wagmi';

import type {
  GetSnapsResponse,
  InvokeSnapParams,
  RequestSnapsParams,
  RequestSnapsResponse,
} from '~/types/snap';

export const useSnaps = () => {
  const { connector } = useAccount();

  const isMetamask = () => {
    if (!connector?.id.startsWith('io.metamask') && window.ethereum) {
      throw new Error(
        'Snaps are only available on Metamask. Please connect to Metamask to use this feature.'
      );
    }
  };

  const getSnaps = async () => {
    isMetamask();
    const snaps = (await window.ethereum.request({
      method: 'wallet_getSnaps',
      params: [],
    })) as GetSnapsResponse;

    return snaps;
  };

  const requestSnaps = async (params: RequestSnapsParams) => {
    isMetamask();
    const snaps = (await window.ethereum.request({
      method: 'wallet_requestSnaps',
      params,
    })) as RequestSnapsResponse;

    return snaps;
  };

  const invokeSnap = async (params: InvokeSnapParams) => {
    isMetamask();
    const result = (await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params,
    })) as object;

    return result;
  };

  return { getSnaps, requestSnaps, invokeSnap };
};
