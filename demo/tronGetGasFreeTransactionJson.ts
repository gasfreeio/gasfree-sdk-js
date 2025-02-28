import { TronGasFree } from '../src';

const TRON_NILE_CHAIN_ID = Number('0xcd8690dc');
const txMessage = {
  token: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
  serviceProvider: 'TMVQGm1qAQYVdetCeGRRkTWYYrLXuHK2HC',
  user: 'TMVQGm1qAQYVdetCeGRRkTWYYrLXuHK2HC',
  receiver: 'TJM1BE5wq1VdHh3gwjUeyaVkvZp9DVYCfC',
  value: '10000',
  maxFee: '2000',
  deadline: '1726207632',
  version: '1',
  nonce: '2',
};

function getGasFreeTransactionJson() {
  const tronGasFree = new TronGasFree({
    chainId: TRON_NILE_CHAIN_ID,
  });
  const transactionJson = tronGasFree.assembleGasFreeTransactionJson({
    token: txMessage.token,
    serviceProvider: txMessage.serviceProvider,
    user: txMessage.user,
    receiver: txMessage.receiver,
    value: txMessage.value,
    maxFee: txMessage.maxFee,
    deadline: txMessage.deadline,
    version: txMessage.version,
    nonce: txMessage.nonce,
  });
  console.log('transactionJson:', JSON.stringify(transactionJson, null, 2));
  return transactionJson;
}

(() => {
  getGasFreeTransactionJson();
})();
