export interface SmartContractAddresses {
  blinding_factors_manager: string;
  payments: string;
}

export interface Wallet {
  chain_id: number;
  private_key: string;
}

export interface Signer {
  wallet: Wallet;
}

export interface PaymentsConfig {
  rpc_endpoint: string;
  smart_contract_addresses: SmartContractAddresses;
  signer: Signer;
}

export interface JsInput {
  name: string;
  value: string;
}
