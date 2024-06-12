import type * as n from '@nillion/nillion-client-js-browser';

import { nillionConfig } from './config';

export async function compute(
  nillion: typeof n,
  client: n.NillionClient,
  storeIds: string[],
  descriptors: number[]
) {
  const programBindings = new nillion.ProgramBindings(
    import.meta.env.VITE_NILLION_PROGRAM_ID as string
  );

  const partyName = 'Party1';
  const partyId = client.party_id;
  programBindings.add_input_party(partyName, partyId);
  programBindings.add_input_party('Party2', partyId);
  programBindings.add_output_party(partyName, partyId);

  const computeTimeSecrets = new nillion.Secrets();

  descriptors.forEach((v, i) => {
    const newComputeTimeSecret = nillion.Secret.new_integer(
      v === 0 ? String(v + 1) : String(v)
    );
    computeTimeSecrets.insert(`given-${String(i)}`, newComputeTimeSecret);
  });

  const publicVariables = new nillion.PublicVariables();

  const id = await client.compute(
    nillionConfig.cluster_id,
    programBindings,
    storeIds,
    computeTimeSecrets,
    publicVariables
  );
  const result = (await client.compute_result(id)) as {
    euclidean_distance: number;
    match: number;
  };

  const distance = Number(result.euclidean_distance);
  const match = Boolean(parseInt(result.match.toString()));
  return { distance, match };
}
