export type TronAddress = `T${string}`;
export type EvmAddress = `0x${string}`;
export type Address = TronAddress | EvmAddress;

export type ChainInfo = {
  chainId: number;
  gasFreeController: string;
  beacon: string;
  creationCode: string;
};

export interface GasFreeTypedDataMessage extends Record<string, any> {
  token: Address;
  serviceProvider: Address;
  user: Address;
  receiver: Address;
  value: string | number;
  maxFee: string | number;
  deadline: string | number;
  version: string | number;
  nonce: string | number;
}

export interface GasFreeTypedData {
  types: {
    PermitTransfer: {
      name: string;
      type: string;
    }[];
  };
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
  };
  message: GasFreeTypedDataMessage;
}

export interface TronGasFreeTypedData extends GasFreeTypedData {}

export interface EvmGasFreeTypedData extends GasFreeTypedData {
  primaryType: 'PermitTransfer' | 'EIP712Domain';
  types: {
    PermitTransfer: {
      name: string;
      type: string;
    }[];
    EIP712Domain: {
      name: string;
      type: string;
    }[];
  };
}

export type GasFreeLedgerRawHashObject = {
  domainSeparatorHex: string;
  hashStructMessageHex: string;
  permitTransferMessageHash: string;
};
