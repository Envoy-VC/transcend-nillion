import type * as n from '@nillion/nillion-client-js-browser';

import { nillionConfig } from './config';

import type { JsInput } from '~/types/nillion';

export const storeDescriptor = async (
  nillion: typeof n,
  nillionClient: n.NillionClient,
  descriptor: number[]
): Promise<string> => {
  try {
    const secrets = new nillion.Secrets();
    const programID = import.meta.env.VITE_NILLION_PROGRAM_ID as string;

    const secretsToStore: JsInput[] = [];

    for (let i = 0; i < descriptor.length; i++) {
      secretsToStore.push({
        name: `actual-${String(i)}`,
        value: String(descriptor[i] === 0 ? 1 : descriptor[i]),
      });
    }

    for (const secret of secretsToStore) {
      const newSecret = nillion.Secret.new_integer(secret.value.toString());
      secrets.insert(secret.name, newSecret);
    }

    const userID = nillionClient.user_id;

    const programBindings = new nillion.ProgramBindings(programID);
    const partyID = nillionClient.party_id;
    programBindings.add_input_party('Party1', partyID);

    const permissions = nillion.Permissions.default_for_user(userID);

    const computePermissions: Record<string, string[]> = {
      [userID]: [programID],
    };

    permissions.add_compute_permissions(computePermissions);

    const storeID = await nillionClient.store_secrets(
      nillionConfig.cluster_id,
      secrets,
      programBindings,
      permissions
    );
    return storeID;
  } catch (error) {
    console.log(error);
    throw new Error('Error storing descriptor');
  }
};
