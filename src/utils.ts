// @ts-ignore
import TronWeb from 'tronweb';
import { toChecksumAddress } from '@ethereumjs/util';

import { EvmAddress, TronAddress } from './types';

export function toEthAddress(tronAddress: string): EvmAddress {
  return toChecksumAddress(`0x${TronWeb.address.toHex(tronAddress).slice(2)}`) as EvmAddress;
}

export function ethToTronAddress(ethAddress: string): TronAddress {
  return TronWeb.address.fromHex(ethAddress);
}

export function isDef(val: any) {
  return val !== undefined && val !== null;
}
