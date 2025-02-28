import { DefaultChainInfoMap, PermitTransfer, TRON_CHAIN_ID } from '../constant/common';
import { TronGasFree } from '../TronGasFree';
import { ethToTronAddress, toEthAddress } from '../utils';
import {
  TRON_DOMAIN_SEPARATOR,
  tronAddressList,
  tronMessageList,
  TRON_EIP712_DOMAIN,
} from './constant';

const NILE_GAS_FREE_CONTROLLER = DefaultChainInfoMap[TRON_CHAIN_ID.NILE].gasFreeController;
const BEACON = DefaultChainInfoMap[TRON_CHAIN_ID.NILE].beacon;
const CREATION_CODE = DefaultChainInfoMap[TRON_CHAIN_ID.NILE].creationCode;

describe('test init TronGasFree', () => {
  it('should create instance with valid chainId', () => {
    const tronGasFree = new TronGasFree({ chainId: TRON_CHAIN_ID.NILE });
    expect(tronGasFree).toBeDefined();
  });
  it('should create instance with valid chainInfo', () => {
    const validChainInfo = {
      chainId: TRON_CHAIN_ID.NILE,
      gasFreeController: 'TSKUEvoSL84jQMKMuCVhr2HcE1Rvm3fe8g',
      beacon: 'TCPvgMqAmH46hG6NUsN6SFNHqNg92oKNBu',
      creationCode: CREATION_CODE,
    };
    const tronGasFree = new TronGasFree({ chainInfo: validChainInfo });

    expect(tronGasFree).toBeDefined();
  });
  it('should throw error when invalid chainId', () => {
    expect(() => new TronGasFree({ chainId: 122 })).toThrow();
  });

  it('should throw error when invalid chainId', () => {
    expect(() => new TronGasFree({ chainId: 0xfffffffffff })).toThrow();
  });

  it('should throw error when neither chainId nor chainInfo is provided', () => {
    expect(() => new TronGasFree({})).toThrow();
  });

  it('should throw error when invalid gasFreeFactory', () => {
    const invalidChainInfo = {
      chainId: TRON_CHAIN_ID.NILE,
      gasFreeController: '',
      beacon: 'TCPvgMqAmH46hG6NUsN6SFNHqNg92oKNBu',
      creationCode: CREATION_CODE,
    };
    expect(() => new TronGasFree({ chainInfo: invalidChainInfo })).toThrow();
  });

  it('should throw error when invalid beacon', () => {
    const invalidChainInfo = {
      chainId: TRON_CHAIN_ID.NILE,
      gasFreeController: 'TSKUEvoSL84jQMKMuCVhr2HcE1Rvm3fe8g',
      beacon: '',
      creationCode: CREATION_CODE,
    };
    expect(() => new TronGasFree({ chainInfo: invalidChainInfo })).toThrow();
  });
  it('should throw error when invalid chainId', () => {
    const invalidChainInfo = {
      chainId: 0,
      gasFreeController: 'TSKUEvoSL84jQMKMuCVhr2HcE1Rvm3fe8g',
      beacon: 'TCPvgMqAmH46hG6NUsN6SFNHqNg92oKNBu',
      creationCode: CREATION_CODE,
    };
    expect(() => new TronGasFree({ chainInfo: invalidChainInfo })).toThrow();
  });

  it('should throw error when invalid creationCode', () => {
    const invalidChainInfo = {
      chainId: TRON_CHAIN_ID.NILE,
      gasFreeController: 'TSKUEvoSL84jQMKMuCVhr2HcE1Rvm3fe8g',
      beacon: 'TCPvgMqAmH46hG6NUsN6SFNHqNg92oKNBu',
      creationCode: '',
    };
    expect(() => new TronGasFree({ chainInfo: invalidChainInfo })).toThrow();
  });

  it('should throw error when invalid creationCode', () => {
    const invalidChainInfo = {
      chainId: TRON_CHAIN_ID.NILE,
      gasFreeController: 'TSKUEvoSL84jQMKMuCVhr2HcE1Rvm3fe8g',
      beacon: 'TCPvgMqAmH46hG6NUsN6SFNHqNg92oKNBu',
      creationCode: 1234,
    };
    // @ts-ignore
    expect(() => new TronGasFree({ chainInfo: invalidChainInfo })).toThrow();
  });
  it('should throw error when invalid hex creationCode', () => {
    const invalidChainInfo = {
      chainId: TRON_CHAIN_ID.NILE,
      gasFreeController: 'TSKUEvoSL84jQMKMuCVhr2HcE1Rvm3fe8g',
      beacon: 'TCPvgMqAmH46hG6NUsN6SFNHqNg92oKNBu',
      creationCode: 'abcdefg',
    };
    expect(() => new TronGasFree({ chainInfo: invalidChainInfo })).toThrow();
  });
  it('should throw error when invalid not even creationCode', () => {
    const invalidChainInfo = {
      chainId: TRON_CHAIN_ID.NILE,
      gasFreeController: 'TSKUEvoSL84jQMKMuCVhr2HcE1Rvm3fe8g',
      beacon: 'TCPvgMqAmH46hG6NUsN6SFNHqNg92oKNBu',
      creationCode: '1111111',
    };
    expect(() => new TronGasFree({ chainInfo: invalidChainInfo })).toThrow();
  });

  it('should throw error when invalid creationCode', () => {
    const invalidChainInfo = {
      chainId: TRON_CHAIN_ID.NILE,
      gasFreeController: 'TSKUEvoSL84jQMKMuCVhr2HcE1Rvm3fe8g',
      beacon: 'TCPvgMqAmH46hG6NUsN6SFNHqNg92oKNBu',
      creationCode: '000',
    };
    expect(() => new TronGasFree({ chainInfo: invalidChainInfo })).toThrow();
  });
});

describe('test TronGasFree', () => {
  let tronGasFree: TronGasFree;

  beforeEach(() => {
    tronGasFree = new TronGasFree({ chainId: TRON_CHAIN_ID.NILE });
  });

  tronAddressList.forEach(
    ({
      user,
      salt: EXPECT_SALT,
      bytecodeHash: EXPECT_BYTE_CODE_HASH,
      gasFreeAddress: EXPECT_CREATE2_ADDRESS,
    }) => {
      it('test calcGasFreeAddress', async () => {
        const salt = tronGasFree.calculateSalt(user);
        const bytecodeHash = tronGasFree.calculateBytecodeHash(user, BEACON, CREATION_CODE);
        const create2Address = ethToTronAddress(
          tronGasFree.calculateCreate2Address(salt, bytecodeHash, NILE_GAS_FREE_CONTROLLER),
        );

        expect(salt).toBe(EXPECT_SALT);
        expect(bytecodeHash).toBe(EXPECT_BYTE_CODE_HASH);
        expect(create2Address).toBe(EXPECT_CREATE2_ADDRESS);
      });

      it('test calculateGasFreeContractAddress ', () => {
        const create2Address = ethToTronAddress(
          tronGasFree.calculateGasFreeContractAddress(
            user,
            NILE_GAS_FREE_CONTROLLER,
            BEACON,
            CREATION_CODE,
          ),
        );

        expect(create2Address).toBe(EXPECT_CREATE2_ADDRESS);
      });

      it('test generateGasFreeAddress - should generate tron gasFree address', async () => {
        const gasFreeAddress = tronGasFree.generateGasFreeAddress(user);

        expect(gasFreeAddress).toBe(EXPECT_CREATE2_ADDRESS);
      });
    },
  );

  it('test calculateSalt - should throw error for invalid address', () => {
    expect(() => tronGasFree.calculateSalt('invalid')).toThrow();
  });

  it('test addFunctionSelectorToAddress - should throw error for invalid address', () => {
    expect(() => tronGasFree.addFunctionSelectorToAddress('invalid')).toThrow();
  });

  it('test calculateBytecodeHash - should throw error for invalid address', () => {
    expect(() => tronGasFree.calculateBytecodeHash('invalid', '0x1234', '0x1234')).toThrow();
  });

  it('test calculateGasFreeContractAddress - should throw error for invalid user address', () => {
    expect(() =>
      tronGasFree.calculateGasFreeContractAddress(
        'invalid',
        NILE_GAS_FREE_CONTROLLER,
        BEACON,
        CREATION_CODE,
      ),
    ).toThrow();
  });

  it('test generateGasFreeAddress should throw error when user address is invalid', () => {
    expect(() => tronGasFree.generateGasFreeAddress('invalidAddress')).toThrow(
      'Invalid user address: invalidAddress',
    );
  });

  tronMessageList.forEach(
    ({ message, encodeMessage: EXPECT_ENCORDMESSAGE, permitHash: EXPECT_PEIMITHASH }) => {
      it('test getGasFreeLedgerRawHash', async () => {
        const EXPECT_DOMAIN = TRON_DOMAIN_SEPARATOR;
        const { domainSeparatorHex, hashStructMessageHex, permitTransferMessageHash } =
          tronGasFree.getGasFreeLedgerRawHash({ message });

        expect(domainSeparatorHex).toBe(EXPECT_DOMAIN);
        expect(hashStructMessageHex).toBe(EXPECT_ENCORDMESSAGE);
        expect(permitTransferMessageHash).toBe(EXPECT_PEIMITHASH);
      });
    },
  );

  it('should assemble valid transaction JSON', () => {
    const txMessage = {
      token: toEthAddress('TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf'),
      serviceProvider: toEthAddress('TDbJyQ6g1Lx9BAfEEeN5S5TMjjDRAVFCaA'),
      user: toEthAddress('TLFXfejEMgivFDR2x8qBpukMXd56spmFhz'),
      receiver: toEthAddress('TJM1BE5wq1VdHh3gwjUeyaVkvZp9DVYCfC'),
      value: '10000',
      maxFee: '2000',
      deadline: '1726207632',
      version: '1',
      nonce: '2',
    };
    const { types, domain, message } = tronGasFree.assembleGasFreeTransactionJson({
      token: ethToTronAddress(txMessage.token),
      serviceProvider: ethToTronAddress(txMessage.serviceProvider),
      user: ethToTronAddress(txMessage.user),
      receiver: ethToTronAddress(txMessage.receiver),
      value: txMessage.value,
      maxFee: txMessage.maxFee,
      deadline: txMessage.deadline,
      version: txMessage.version,
      nonce: txMessage.nonce,
    });

    expect(domain).toEqual(TRON_EIP712_DOMAIN);
    expect(types).toEqual({ PermitTransfer });
    expect(message).toEqual({
      token: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
      serviceProvider: 'TDbJyQ6g1Lx9BAfEEeN5S5TMjjDRAVFCaA',
      user: 'TLFXfejEMgivFDR2x8qBpukMXd56spmFhz',
      receiver: 'TJM1BE5wq1VdHh3gwjUeyaVkvZp9DVYCfC',
      value: '10000',
      maxFee: '2000',
      deadline: '1726207632',
      version: '1',
      nonce: '2',
    });
  });

  it('test assembleGasFreeTransactionJson - should throw error for invalid contract address', () => {
    expect(() =>
      tronGasFree.assembleGasFreeTransactionJson({
        token: 'invalid',
        serviceProvider: '0x21E9464081d6e7964e383d52a45eC000a6171FCA',
        user: '0x9e747Ac885cD7bC5d0A2DfFCd23f5cCdEdCBD1c5',
        receiver: '0x5bE049630A2c8B18F1B6BF53bE95120A3f982fcc',
        value: '10000',
        maxFee: '2000',
        deadline: '1726207632',
        version: '1',
        nonce: '2',
      }),
    ).toThrow();
  });

  it('test assembleGasFreeTransactionJson - should throw error for invalid provider address', () => {
    expect(() =>
      tronGasFree.assembleGasFreeTransactionJson({
        token: '0xECa9bC828A3005B9a3b909f2cc5c2a54794DE05F',
        serviceProvider: 'invalid',
        user: '0x9e747Ac885cD7bC5d0A2DfFCd23f5cCdEdCBD1c5',
        receiver: '0x5bE049630A2c8B18F1B6BF53bE95120A3f982fcc',
        value: '10000',
        maxFee: '2000',
        deadline: '1726207632',
        version: '1',
        nonce: '2',
      }),
    ).toThrow();
  });

  it('test assembleGasFreeTransactionJson - should throw error for invalid user address', () => {
    expect(() =>
      tronGasFree.assembleGasFreeTransactionJson({
        token: '0xECa9bC828A3005B9a3b909f2cc5c2a54794DE05F',
        serviceProvider: '0x21E9464081d6e7964e383d52a45eC000a6171FCA',
        user: 'invalid',
        receiver: '0x5bE049630A2c8B18F1B6BF53bE95120A3f982fcc',
        value: '10000',
        maxFee: '2000',
        deadline: '1726207632',
        version: '1',
        nonce: '2',
      }),
    ).toThrow();
  });

  it('test assembleGasFreeTransactionJson - should throw error for invalid receiver address', () => {
    expect(() =>
      tronGasFree.assembleGasFreeTransactionJson({
        token: '0xECa9bC828A3005B9a3b909f2cc5c2a54794DE05F',
        serviceProvider: '0x21E9464081d6e7964e383d52a45eC000a6171FCA',
        user: '0x9e747Ac885cD7bC5d0A2DfFCd23f5cCdEdCBD1c5',
        receiver: 'invalid',
        value: '10000',
        maxFee: '2000',
        deadline: '1726207632',
        version: '1',
        nonce: '2',
      }),
    ).toThrow();
  });

  it('test assembleGasFreeTransactionJson - should throw error for invalid value', () => {
    expect(() =>
      tronGasFree.assembleGasFreeTransactionJson({
        token: '0xECa9bC828A3005B9a3b909f2cc5c2a54794DE05F',
        serviceProvider: '0x21E9464081d6e7964e383d52a45eC000a6171FCA',
        user: '0x9e747Ac885cD7bC5d0A2DfFCd23f5cCdEdCBD1c5',
        receiver: '0x5bE049630A2c8B18F1B6BF53bE95120A3f982fcc',
        value: 'qqqq',
        maxFee: '2000',
        deadline: '1726207632',
        version: '1',
        nonce: '2',
      }),
    ).toThrow();
  });

  it('test assembleGasFreeTransactionJson - should throw error for value is not string', () => {
    expect(() =>
      tronGasFree.assembleGasFreeTransactionJson({
        token: '0xECa9bC828A3005B9a3b909f2cc5c2a54794DE05F',
        serviceProvider: '0x21E9464081d6e7964e383d52a45eC000a6171FCA',
        user: '0x9e747Ac885cD7bC5d0A2DfFCd23f5cCdEdCBD1c5',
        receiver: '0x5bE049630A2c8B18F1B6BF53bE95120A3f982fcc',
        // @ts-ignore
        value: 1234,
        maxFee: '2000',
        deadline: '1726207632',
        version: '1',
        nonce: '2',
      }),
    ).toThrow();
  });

  it('test assembleGasFreeTransactionJson - should throw error for invalid maxFee', () => {
    expect(() =>
      tronGasFree.assembleGasFreeTransactionJson({
        token: '0xECa9bC828A3005B9a3b909f2cc5c2a54794DE05F',
        serviceProvider: '0x21E9464081d6e7964e383d52a45eC000a6171FCA',
        user: '0x9e747Ac885cD7bC5d0A2DfFCd23f5cCdEdCBD1c5',
        receiver: '0x5bE049630A2c8B18F1B6BF53bE95120A3f982fcc',
        value: '20000',
        maxFee: 'qqq',
        deadline: '1726207632',
        version: '1',
        nonce: '2',
      }),
    ).toThrow();
  });

  it('test assembleGasFreeTransactionJson - should throw error for maxFee is not string', () => {
    expect(() =>
      tronGasFree.assembleGasFreeTransactionJson({
        token: '0xECa9bC828A3005B9a3b909f2cc5c2a54794DE05F',
        serviceProvider: '0x21E9464081d6e7964e383d52a45eC000a6171FCA',
        user: '0x9e747Ac885cD7bC5d0A2DfFCd23f5cCdEdCBD1c5',
        receiver: '0x5bE049630A2c8B18F1B6BF53bE95120A3f982fcc',
        value: '20000',
        // @ts-ignore
        maxFee: 1234,
        deadline: '1726207632',
        version: '1',
        nonce: '2',
      }),
    ).toThrow();
  });

  it('test assembleGasFreeTransactionJson - should throw error for invalid deadline', () => {
    expect(() =>
      tronGasFree.assembleGasFreeTransactionJson({
        token: '0xECa9bC828A3005B9a3b909f2cc5c2a54794DE05F',
        serviceProvider: '0x21E9464081d6e7964e383d52a45eC000a6171FCA',
        user: '0x9e747Ac885cD7bC5d0A2DfFCd23f5cCdEdCBD1c5',
        receiver: '0x5bE049630A2c8B18F1B6BF53bE95120A3f982fcc',
        value: '20000',
        maxFee: '2000',
        deadline: 'qqqq',
        version: '1',
        nonce: '2',
      }),
    ).toThrow();
  });

  it('test assembleGasFreeTransactionJson - should throw error for deadline is not string/number', () => {
    expect(() =>
      tronGasFree.assembleGasFreeTransactionJson({
        token: '0xECa9bC828A3005B9a3b909f2cc5c2a54794DE05F',
        serviceProvider: '0x21E9464081d6e7964e383d52a45eC000a6171FCA',
        user: '0x9e747Ac885cD7bC5d0A2DfFCd23f5cCdEdCBD1c5',
        receiver: '0x5bE049630A2c8B18F1B6BF53bE95120A3f982fcc',
        value: '20000',
        maxFee: '2000',
        // @ts-ignore
        deadline: [],
        version: '1',
        nonce: '2',
      }),
    ).toThrow();
  });

  it('test assembleGasFreeTransactionJson - should throw error for deadline is less than 0', () => {
    expect(() =>
      tronGasFree.assembleGasFreeTransactionJson({
        token: '0xECa9bC828A3005B9a3b909f2cc5c2a54794DE05F',
        serviceProvider: '0x21E9464081d6e7964e383d52a45eC000a6171FCA',
        user: '0x9e747Ac885cD7bC5d0A2DfFCd23f5cCdEdCBD1c5',
        receiver: '0x5bE049630A2c8B18F1B6BF53bE95120A3f982fcc',
        value: '20000',
        maxFee: '2000',
        deadline: '-1',
        version: '1',
        nonce: '2',
      }),
    ).toThrow();
  });

  it('test assembleGasFreeTransactionJson - should throw error for invalid version', () => {
    expect(() =>
      tronGasFree.assembleGasFreeTransactionJson({
        token: '0xECa9bC828A3005B9a3b909f2cc5c2a54794DE05F',
        serviceProvider: '0x21E9464081d6e7964e383d52a45eC000a6171FCA',
        user: '0x9e747Ac885cD7bC5d0A2DfFCd23f5cCdEdCBD1c5',
        receiver: '0x5bE049630A2c8B18F1B6BF53bE95120A3f982fcc',
        value: '20000',
        maxFee: '2000',
        deadline: '1726207632',
        version: 'www',
        nonce: '2',
      }),
    ).toThrow();
  });

  it('test assembleGasFreeTransactionJson - should throw error for invalid nonce', () => {
    expect(() =>
      tronGasFree.assembleGasFreeTransactionJson({
        token: '0xECa9bC828A3005B9a3b909f2cc5c2a54794DE05F',
        serviceProvider: '0x21E9464081d6e7964e383d52a45eC000a6171FCA',
        user: '0x9e747Ac885cD7bC5d0A2DfFCd23f5cCdEdCBD1c5',
        receiver: '0x5bE049630A2c8B18F1B6BF53bE95120A3f982fcc',
        value: '20000',
        maxFee: '2000',
        deadline: '1726207632',
        version: '1',
        nonce: 'aa',
      }),
    ).toThrow();
  });
});
