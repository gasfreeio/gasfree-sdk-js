import { TronGasFree } from '../src';

const userAddress = 'TMVQGm1qAQYVdetCeGRRkTWYYrLXuHK2HC';
const TRON_NILE_CHAIN_ID = Number('0xcd8690dc');

function generateGasFreeAddress() {
  try {
    const tronGasFree = new TronGasFree({
      chainId: TRON_NILE_CHAIN_ID,
    });
    const gasFreeAddress = tronGasFree.generateGasFreeAddress(userAddress);
    console.log('gasFreeAddress:', gasFreeAddress);
  } catch (error) {
    console.log(error);
  }
}

(() => {
  generateGasFreeAddress();
})();
