// @ts-ignore
import { TronWeb } from 'tronweb';
import { isValidChecksumAddress as isValidEthereumChecksumAddress } from '@ethereumjs/util';
import { validate } from 'jsonschema';

import { AssembleGasFreeTransactionParams, GasFree, GasFreeParameter } from './GasFree';
import { ethToTronAddress } from './utils';
import type { TronGasFreeTypedData, TronAddress, GasFreeTypedDataMessage } from './types';
import { MESSAGE_TYPED_DATA_SCHEMA } from './constant/schema';

export class TronGasFree extends GasFree {
  constructor(gasFreeParameter: GasFreeParameter) {
    super(gasFreeParameter);
  }

  protected checkIsValidAddress(address: string | undefined): boolean {
    if (!address) {
      return false;
    }

    return TronWeb.isAddress(address) || isValidEthereumChecksumAddress(address);
  }

  public checkIsValidGasFreeTypedDataParams({ message }: { message: GasFreeTypedDataMessage }) {
    const messageValidation = validate(message, MESSAGE_TYPED_DATA_SCHEMA);
    if (messageValidation.errors.length > 0) {
      throw new Error(`Invalid input message`);
    }

    if (!TronWeb.isAddress(message.token)) {
      throw new Error(`Invalid message.token: ${message.token}, should be a valid Tron address`);
    }

    if (!TronWeb.isAddress(message.user)) {
      throw new Error(`Invalid message.token: ${message.user}, should be a valid Tron address`);
    }

    if (!TronWeb.isAddress(message.receiver)) {
      throw new Error(`Invalid message.token: ${message.receiver}, should be a valid Tron address`);
    }

    if (!TronWeb.isAddress(message.serviceProvider)) {
      throw new Error(
        `Invalid message.token: ${message.serviceProvider}, should be a valid Tron address`,
      );
    }

    return true;
  }

  public generateGasFreeAddress(userAddress: string): TronAddress {
    if (!TronWeb.isAddress(userAddress)) {
      throw Error(`Invalid user address: ${userAddress}`);
    }

    const salt = this.calculateSalt(userAddress);
    const bytecodeHash = this.calculateBytecodeHash(
      userAddress,
      this.chainInfo.beacon,
      this.chainInfo.creationCode,
    );

    return ethToTronAddress(
      this.calculateCreate2Address(salt, bytecodeHash, this.chainInfo.gasFreeController),
    );
  }

  protected getCreate2PrefixByte(): string {
    return '0x41';
  }

  public assembleGasFreeTransactionJson(
    parameters: AssembleGasFreeTransactionParams,
  ): TronGasFreeTypedData {
    const {
      domain: domainTron,
      types,
      message: messageTron,
    } = super.assembleStandard712GasFreeTransactionJson(parameters);

    const message = {
      ...messageTron,
      token: ethToTronAddress(messageTron.token),
      serviceProvider: ethToTronAddress(messageTron.serviceProvider),
      user: ethToTronAddress(messageTron.user),
      receiver: ethToTronAddress(messageTron.receiver),
    };

    const domain = {
      ...domainTron,
      verifyingContract: ethToTronAddress(domainTron.verifyingContract),
    };

    return {
      domain,
      types: {
        PermitTransfer: types.PermitTransfer,
      },
      message,
    };
  }
}
