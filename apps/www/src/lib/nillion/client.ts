import * as nillion from '@nillion/nillion-client-js-browser/nillion_client_js_browser.js';
import {
  NillionClient,
  type NodeKey,
  type UserKey,
} from '@nillion/nillion-client-js-browser/nillion_client_js_browser.js';

import { nillionConfig } from './config';

import type { PaymentsConfig } from '~/types/nillion';

export const initializeNillionClient = (
  userkey: UserKey,
  nodekey: NodeKey,
  websockets: string[],
  paymentsConfig: PaymentsConfig
): NillionClient => {
  const client = new NillionClient(
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

  const wl = process.env.NEXT_PUBLIC_NILLION_NODEKEY_ALLOWLISTED_SEED
    ? process.env.NEXT_PUBLIC_NILLION_NODEKEY_ALLOWLISTED_SEED.split(', ')
    : [`scaffold-eth-${String(Math.floor(Math.random() * 10000))}`];
  const randomElement = wl[Math.floor(Math.random() * wl.length)];
  const nodeKey = nillion.NodeKey.from_seed(randomElement ?? '');

  const client = initializeNillionClient(
    nillionUserKey,
    nodeKey,
    nillionConfig.websockets,
    nillionConfig.payments_config as PaymentsConfig
  );
  return {
    client,
    nillion,
  };
};
