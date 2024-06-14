import type * as n from '@nillion/nillion-client-js-browser';

import { nillionConfig } from './config';

export async function retrieveSecret(
  nillionClient: n.NillionClient,
  storeID: string,
  secretName: string,
  type: 'string' | 'number'
) {
  const retrieved = await nillionClient.retrieve_secret(
    nillionConfig.cluster_id,
    storeID,
    secretName
  );

  try {
    const res = retrieved.to_integer();
    return res;
  } catch (error) {
    const byteArraySecret = retrieved.to_byte_array();
    const decodedValue = new TextDecoder('utf-8').decode(byteArraySecret);
    return decodedValue;
  }
}
