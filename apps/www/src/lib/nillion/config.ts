/* eslint-disable @typescript-eslint/no-non-null-assertion -- dynamic env */
export const nillionConfig = {
  websockets: [import.meta.env.VITE_NILLION_WEBSOCKETS!],
  cluster_id: import.meta.env.VITE_NILLION_CLUSTER_ID as string,
  payments_config: {
    rpc_endpoint: import.meta.env
      .VITE_NILLION_BLOCKCHAIN_RPC_ENDPOINT as string,
    smart_contract_addresses: {
      blinding_factors_manager: import.meta.env
        .VITE_NILLION_BLINDING_FACTORS_MANAGER_SC_ADDRESS as string,
      payments: import.meta.env.VITE_NILLION_PAYMENTS_SC_ADDRESS as string,
    },
    signer: {
      wallet: {
        chain_id: parseInt(import.meta.env.VITE_NILLION_CHAIN_ID as string),
        private_key: import.meta.env.VITE_NILLION_WALLET_PRIVATE_KEY as string,
      },
    },
  },
};
