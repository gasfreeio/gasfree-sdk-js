// @ts-ignore
import TronWeb from 'tronweb';
import { isValidChecksumAddress as isValidEthereumChecksumAddress } from '@ethereumjs/util';

import { AssembleGasFreeTransactionParams, GasFree, GasFreeParameter } from './GasFree';
import { ethToTronAddress } from './utils';
import type { TronGasFreeTypedData, TronAddress } from './types';

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
