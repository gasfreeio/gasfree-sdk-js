import { TypedDataUtils } from 'eth-sig-util';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { bufferToHex, toBuffer } from '@ethereumjs/util';
// @ts-ignore
import abi from 'ethereumjs-abi';

import { isDef, toEthAddress } from './utils';
import { DefaultChainInfoMap, EIP712Domain } from './constant/common';
import { PermitTransfer } from './constant/common';
import type {
  ChainInfo,
  GasFreeLedgerRawHashObject,
  TronAddress,
  EvmAddress,
  EvmGasFreeTypedData,
  GasFreeTypedDataMessage,
} from './types';

export interface GasFreeParameter {
  chainId?: number;
  chainInfo?: ChainInfo;
}

export interface AssembleGasFreeTransactionParams {
  token: string;
  serviceProvider: string;
  user: string;
  receiver: string;
  value: string;
  maxFee: string;
  deadline: string;
  version: string;
  nonce: string;
}

export abstract class GasFree {
  protected readonly chainInfo: ChainInfo;

  protected constructor(gasFreeParameter: GasFreeParameter) {
    const { chainId, chainInfo } = gasFreeParameter;

    if ((isDef(chainId) && isDef(chainInfo)) || (!isDef(chainId) && !isDef(chainInfo))) {
      throw Error(
        `Invalid arguments provided. This function requires exactly one argument: either chainId or chainInfo, but not both.`,
      );
    }

    if (isDef(chainId)) {
      if (!this.checkIsValidChainId(chainId)) {
        throw Error(`Invalid chainId: ${chainId}`);
      }

      const defaultChainInfo = DefaultChainInfoMap[chainId as number];
      if (!defaultChainInfo) {
        throw Error(`Invalid chainId: ${chainId}`);
      }

      this.chainInfo = defaultChainInfo;
    } else {
      const { chainId, gasFreeController, beacon, creationCode } = chainInfo as ChainInfo;

      if (!this.checkIsValidChainId(chainId)) {
        throw Error(`Invalid chainId: ${chainId}`);
      }

      if (!this.checkIsValidAddress(gasFreeController)) {
        throw Error(`Invalid gasFreeController: ${gasFreeController}`);
      }

      if (!this.checkIsValidAddress(beacon)) {
        throw Error(`Invalid beacon: ${beacon}`);
      }

      if (!this.checkIsValidCreationCode(creationCode)) {
        throw Error(`Invalid creationCode: ${creationCode}`);
      }

      this.chainInfo = {
        chainId,
        gasFreeController,
        beacon,
        creationCode,
      };
    }
  }

  private checkIsValidChainId(chainId: string | number | undefined): boolean {
    const numericChainId = Number(chainId);

    if (!Number.isInteger(numericChainId) || numericChainId <= 0) {
      return false;
    }

    const MAX_CHAIN_ID = Number('0xffffffff');
    if (numericChainId > MAX_CHAIN_ID) {
      return false;
    }

    return true;
  }

  private checkIsValidCreationCode(creationCode: string | undefined): boolean {
    try {
      if (!creationCode) {
        return false;
      }
      creationCode = creationCode.startsWith('0x') ? creationCode.slice(2) : creationCode;

      // check is hex
      if (!/^[0-9a-fA-F]*$/.test(creationCode)) {
        return false;
      }

      // check length is even
      if (creationCode.length % 2 !== 0) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  public assembleStandard712GasFreeTransactionJson({
    token,
    serviceProvider,
    user,
    receiver,
    value,
    maxFee,
    deadline,
    version,
    nonce,
  }: AssembleGasFreeTransactionParams): EvmGasFreeTypedData {
    if (!this.checkIsValidAddress(token)) {
      throw Error(`Invalid token: ${token}`);
    }

    if (!this.checkIsValidAddress(serviceProvider)) {
      throw Error(`Invalid serviceProvider: ${serviceProvider}`);
    }

    if (!this.checkIsValidAddress(user)) {
      throw Error(`Invalid user: ${user}`);
    }

    if (!this.checkIsValidAddress(receiver)) {
      throw Error(`Invalid receiver: ${receiver}`);
    }

    if (typeof value !== 'string') {
      throw Error(`'value' must be a string of numbers: ${value}`);
    }

    if (typeof maxFee !== 'string') {
      throw Error(`'maxFee' must be a string of numbers: ${maxFee}`);
    }

    if (!this.checkIsValidMessageNumber(value)) {
      throw Error(`Invalid value: ${value}`);
    }

    if (!this.checkIsValidMessageNumber(maxFee)) {
      throw Error(`Invalid maxFee: ${maxFee}`);
    }

    if (!this.checkIsValidMessageNumber(deadline)) {
      throw Error(`Invalid deadline: ${deadline}`);
    }

    if (!this.checkIsValidMessageNumber(version)) {
      throw Error(`Invalid version: ${version}`);
    }

    if (!this.checkIsValidMessageNumber(nonce)) {
      throw Error(`Invalid nonce: ${nonce}`);
    }

    const domain = this.getGasFreeTypedDataDomain();

    const types = {
      PermitTransfer,
      EIP712Domain,
    };

    const message = {
      token: toEthAddress(token),
      serviceProvider: toEthAddress(serviceProvider),
      user: toEthAddress(user),
      receiver: toEthAddress(receiver),
      value,
      maxFee,
      deadline,
      version,
      nonce,
    };

    return { types, domain, message, primaryType: 'PermitTransfer' };
  }

  protected checkIsValidMessageNumber(value: string | number) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return false;
    }

    try {
      const bigIntNum = BigInt(value);
      if (bigIntNum < 0n) {
        return false;
      }
    } catch {
      return false;
    }

    return true;
  }

  // calc salt
  public calculateSalt(address: string): string {
    if (!this.checkIsValidAddress(address)) {
      throw Error(`Invalid address: ${address}`);
    }
    const addressBytes = toEthAddress(address);
    return '0x' + addressBytes.slice(2).padStart(64, '0');
  }

  public addFunctionSelectorToAddress(address: string): string {
    if (!address.startsWith('0x') || address.length !== 66) {
      throw new Error('Invalid address format');
    }
    const functionSignature = 'initialize(address)';
    const funcSelector = bufferToHex(keccak256(Buffer.from(functionSignature)) as Buffer).slice(
      0,
      10,
    );
    return funcSelector + address.slice(2);
  }

  public calculateBytecodeHash(address: string, beacon: string, creationCode: string): string {
    if (!this.checkIsValidAddress(address)) {
      throw Error(`Invalid address: ${address}`);
    }
    const initializeData = this.addFunctionSelectorToAddress(this.calculateSalt(address));
    const beaconAddress = toEthAddress(beacon);

    const encodedData = Buffer.concat([
      toBuffer(creationCode),
      toBuffer(abi.rawEncode(['address', 'bytes'], [beaconAddress, toBuffer(initializeData)])),
    ]);

    return `${bufferToHex(keccak256(Buffer.from(encodedData)) as Buffer)}`;
  }

  public calculateCreate2Address(
    salt: string,
    bytecodeHash: string,
    gasFreeController: string,
  ): EvmAddress {
    const gasFreeControllerHex = toEthAddress(gasFreeController);
    const create2Input = Buffer.concat([
      toBuffer(this.getCreate2PrefixByte()),
      toBuffer(gasFreeControllerHex),
      toBuffer(salt),
      toBuffer(bytecodeHash),
    ]);
    const ethAddress: EvmAddress = `0x${bufferToHex(keccak256(create2Input) as Buffer).slice(26)}`;
    return ethAddress;
  }

  public calculateGasFreeContractAddress(
    userAddress: string,
    gasFreeController: string,
    beacon: string,
    creationCode: string,
  ): string {
    if (!this.checkIsValidAddress(userAddress)) {
      throw Error(`Invalid userAddress: ${userAddress}`);
    }
    const salt = this.calculateSalt(userAddress);
    const bytecodeHash = this.calculateBytecodeHash(userAddress, beacon, creationCode);
    return this.calculateCreate2Address(salt, bytecodeHash, gasFreeController);
  }

  public getGasFreeLedgerRawHash({
    message,
  }: {
    message: GasFreeTypedDataMessage;
  }): GasFreeLedgerRawHashObject {
    const domain = this.getGasFreeTypedDataDomain();

    const domainSeparatorHex =
      '0x' +
      TypedDataUtils.hashStruct('EIP712Domain', domain, {
        EIP712Domain,
      }).toString('hex');

    const hashStructMessageHex =
      '0x' +
      TypedDataUtils.hashStruct('PermitTransfer', message as unknown as Record<string, unknown>, {
        PermitTransfer,
      }).toString('hex');

    const permitTransferMessageHash = bufferToHex(
      keccak256(
        Buffer.concat([
          toBuffer('0x1901'),
          toBuffer(domainSeparatorHex),
          toBuffer(hashStructMessageHex),
        ]),
      ) as Buffer,
    );

    return { domainSeparatorHex, hashStructMessageHex, permitTransferMessageHash };
  }

  protected getGasFreeTypedDataDomain() {
    return {
      name: 'GasFreeController',
      version: 'V1.0.0',
      chainId: Number(this.chainInfo.chainId),
      verifyingContract: toEthAddress(this.chainInfo.gasFreeController),
    };
  }

  protected abstract checkIsValidAddress(address?: string): boolean;

  protected abstract getCreate2PrefixByte(): string;

  public abstract generateGasFreeAddress(userAddress?: string): TronAddress | EvmAddress;
}
