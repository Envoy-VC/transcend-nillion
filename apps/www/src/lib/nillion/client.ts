import * as nillion from '@nillion/nillion-client-js-browser';
import { nillionConfig } from './config';

import type { PaymentsConfig } from '~/types/nillion';

export const initializeNillionClient = (
  userkey: nillion.UserKey,
  nodekey: nillion.NodeKey,
  websockets: string[],
  paymentsConfig: PaymentsConfig
): nillion.NillionClient => {
  console.log({
    userkey,
    nodekey,
    websockets,
    paymentsConfig,
  });
  const client = new nillion.NillionClient(
    userkey,
    nodekey,
    websockets,
    paymentsConfig
  );

  return client;
};

export const getNillionClient = async (userKey: string) => {
  await nillion.default();
  const nillionUserKey = nillion.UserKey.from_base58(userKey);

  const wl = import.meta.env.VITE_NILLION_NODEKEY_ALLOWLISTED_SEED
    ? import.meta.env.VITE_NILLION_NODEKEY_ALLOWLISTED_SEED.split(', ')
    : [`scaffold-eth-${String(Math.floor(Math.random() * 10000))}`];
  const randomElement = wl[Math.floor(Math.random() * wl.length)];
  const nodeKey = nillion.NodeKey.from_seed(randomElement ?? '');

  const client = initializeNillionClient(
    nillionUserKey,
    nodeKey,
    nillionConfig.websockets as string[],
    nillionConfig.payments_config as PaymentsConfig
  );
  return {
    client,
    nillion,
  };
};
