import * as nillion from '@nillion/nillion-client-js-browser';

import { nillionConfig } from './config';

import type { PaymentsConfig } from '~/types/nillion';

export const initializeNillionClient = (
  userkey: nillion.UserKey,
  nodekey: nillion.NodeKey,
  websockets: string[],
  paymentsConfig: PaymentsConfig
): nillion.NillionClient => {
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

  const nodeKey = nillion.NodeKey.from_seed(crypto.randomUUID());

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
