// @ts-ignore
import TronWeb from 'tronweb';
import { DefaultChainInfoMap, TRON_CHAIN_ID } from '../constant/common';
import { ethToTronAddress } from '../utils';
import { TronGasFree } from '../TronGasFree';
import { tronAddressList, tronMainnetAddressList, tronMessageList, tronShastaAddressList } from './constant';

const TEST_OWNER_ADDRESS = 'TMVQGm1qAQYVdetCeGRRkTWYYrLXuHK2HC';

describe('test TronGasFree with contract', () => {
  let tronGasFree: TronGasFree;
  const NILE_FULLNODE = 'https://api.nileex.io';
  const tronWeb = new TronWeb({ fullHost: NILE_FULLNODE });
  const contractAddress = DefaultChainInfoMap[TRON_CHAIN_ID.NILE].gasFreeController;

  beforeEach(() => {
    tronGasFree = new TronGasFree({ chainId: TRON_CHAIN_ID.NILE });
  });
  tronAddressList.forEach(({ user }) => {
    it('test generateGasFreeAddress', async () => {
      const contractAllABI = [
        {
          outputs: [{ type: 'address' }],
          inputs: [{ name: 'user', type: 'address' }],
          name: 'getGasFreeAddress',
          stateMutability: 'View',
          type: 'Function',
        },
      ];

      const contract = await tronWeb.contract(contractAllABI, contractAddress);

      const EXPECT_ADDRESS = ethToTronAddress(
        await contract.getGasFreeAddress(user).call({
          from: TEST_OWNER_ADDRESS,
        }),
      );

      const gasFreeAddress = tronGasFree.generateGasFreeAddress(user);

      expect(gasFreeAddress).toBe(EXPECT_ADDRESS);
    });
  });

  tronMessageList.forEach(({ message }) => {
    it('test get permitTransferMessageHash', async () => {
      const contractAllABI = [
        {
          outputs: [{ type: 'bytes32' }],
          inputs: [
            { name: 'token', type: 'address' },
            { name: 'serviceProvider', type: 'address' },
            { name: 'user', type: 'address' },
            { name: 'receiver', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'maxFee', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
            { name: 'version', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
          ],
          name: 'getMessageHashForTransfer',
          stateMutability: 'view',
          type: 'function',
        },
      ];

      const contract = await tronWeb.contract(contractAllABI, contractAddress);

      const EXPECT_PREMIT_MESSAGE_HASH = await contract
        .getMessageHashForTransfer(...Object.values(message))
        .call({ from: TEST_OWNER_ADDRESS });

      const { permitTransferMessageHash } = tronGasFree.getGasFreeLedgerRawHash({ message });

      expect(permitTransferMessageHash).toBe(EXPECT_PREMIT_MESSAGE_HASH);
    });
  });
});

describe('test mainnet environment TronGasFree with contract', () => {
  let tronGasFree: TronGasFree;
  const FULL_NODE_TRONGRID = 'https://api.trongrid.io';
  const tronWeb = new TronWeb({ fullHost: FULL_NODE_TRONGRID });
  const contractAddress = DefaultChainInfoMap[TRON_CHAIN_ID.MAINNET].gasFreeController;

  beforeEach(() => {
    tronGasFree = new TronGasFree({ chainId: TRON_CHAIN_ID.MAINNET });
  });
  tronMainnetAddressList.forEach(({ user, gasFreeAddress: configGasFreeAddress }) => {
    it('test mainnet environment generateGasFreeAddress', async () => {
      const contractAllABI = [
        {
          outputs: [{ type: 'address' }],
          inputs: [{ name: 'user', type: 'address' }],
          name: 'getGasFreeAddress',
          stateMutability: 'View',
          type: 'Function',
        },
      ];

      const contract = await tronWeb.contract(contractAllABI, contractAddress);

      const EXPECT_ADDRESS = ethToTronAddress(
        await contract.getGasFreeAddress(user).call({ from: TEST_OWNER_ADDRESS }),
      );

      const gasFreeAddress = tronGasFree.generateGasFreeAddress(user);

      expect(gasFreeAddress).toBe(EXPECT_ADDRESS);
      expect(gasFreeAddress).toBe(configGasFreeAddress);
    });
  });
});

describe('test shasta environment TronGasFree with contract', () => {
  let tronGasFree: TronGasFree;
  const FULL_NODE_SHASTA = 'https://api.shasta.trongrid.io';
  const tronWeb = new TronWeb({ fullHost: FULL_NODE_SHASTA });
  const contractAddress = DefaultChainInfoMap[TRON_CHAIN_ID.SHASTA].gasFreeController;

  beforeEach(() => {
    tronGasFree = new TronGasFree({ chainId: TRON_CHAIN_ID.SHASTA });
  });
  tronShastaAddressList.forEach(({ user, gasFreeAddress: configGasFreeAddress }) => {
    it('test shasta environment generateGasFreeAddress', async () => {
      const contractAllABI = [
        {
          outputs: [{ type: 'address' }],
          inputs: [{ name: 'user', type: 'address' }],
          name: 'getGasFreeAddress',
          stateMutability: 'View',
          type: 'Function',
        },
      ];

      const contract = await tronWeb.contract(contractAllABI, contractAddress);

      const EXPECT_ADDRESS = ethToTronAddress(
        await contract.getGasFreeAddress(user).call({ from: TEST_OWNER_ADDRESS }),
      );

      const gasFreeAddress = tronGasFree.generateGasFreeAddress(user);

      expect(gasFreeAddress).toBe(EXPECT_ADDRESS);
      expect(gasFreeAddress).toBe(configGasFreeAddress);
    });
  });
});
