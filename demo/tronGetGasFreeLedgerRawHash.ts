import { TronGasFree } from '../src';

const TRON_NILE_CHAIN_ID = Number('0xcd8690dc');

function getGasFreeLedgerRawHash() {
  try {
    const tronGasFree = new TronGasFree({ chainId: TRON_NILE_CHAIN_ID });

    const { domainSeparatorHex, hashStructMessageHex, permitTransferMessageHash } =
      tronGasFree.getGasFreeLedgerRawHash({
        message: {
          token: '0xECa9bC828A3005B9a3b909f2cc5c2a54794DE05F',
          serviceProvider: '0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf',
          user: '0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf',
          receiver: '0x5bE049630A2c8B18F1B6BF53bE95120A3f982fcc',
          value: '10000',
          maxFee: '2000',
          deadline: '1726207632',
          version: '1',
          nonce: '2',
        },
      });

    console.log(
      `
    domainSeparatorHex: ${domainSeparatorHex}
    hashStructMessageHex: ${hashStructMessageHex}
    permitTransferMessageHash: ${permitTransferMessageHash}
    `,
    );
  } catch (error) {
    console.log(error);
  }
}

(() => {
  getGasFreeLedgerRawHash();
})();
