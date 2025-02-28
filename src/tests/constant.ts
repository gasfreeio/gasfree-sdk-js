import { DefaultChainInfoMap, TRON_CHAIN_ID } from '../constant/common';
import { toEthAddress, ethToTronAddress } from '../utils';

export const tronAddressList = [
  {
    user: 'TMVQGm1qAQYVdetCeGRRkTWYYrLXuHK2HC',
    gasFreeAddress: 'TUGC4eNuEgbaLotwxzzXEck1fRWru6n8ye',
    salt: '0x0000000000000000000000007E5F4552091A69125d5DfCb7b8C2659029395Bdf',
    bytecodeHash: '0x05fc7930389726757627ebd6eccfa44c1ed3d61b7bc3eb2a52e33a10c72feb23',
  },
  {
    user: 'TDvSsdrNM5eeXNL3czpa6AxLDHZA9nwe9K',
    gasFreeAddress: 'TLvVuqx74fMy8QMjEsMT4dWwmVbuNwYt8X',
    salt: '0x0000000000000000000000002B5AD5c4795c026514f8317c7a215E218DcCD6cF',
    bytecodeHash: '0x4137db2fd612a7ece04620ebee511bc49ff1dd616f2fa754c337fc4cd3eca2f7',
  },
  {
    user: 'TKTX96CBxr5kvhjsDHcqoiPWZageGxoTW3',
    gasFreeAddress: 'TTjqEjsitExzYsoDaR65nd3d2avhsXayfL',
    salt: '0x0000000000000000000000006813Eb9362372EEF6200f3b1dbC3f819671cBA69',
    bytecodeHash: '0xab0d0d89b6d2921967b3ff3b13b0a9ece958a3a2b3e2c56a60f25e9fba01b722',
  },
  {
    user: 'TCo75zcxTuWn5nnFqZUeK5socdVnG11f2T',
    gasFreeAddress: 'TDd2QwVKX5ujRtCkWGNJUXRD16GyvYLZm3',
    salt: '0x0000000000000000000000001efF47bc3a10a45D4B230B5d10E37751FE6AA718',
    bytecodeHash: '0x3b993129779481dcf8ca137aae0b3ad76e606333e8d1789538cdeafbfdf1dcf3',
  },
  {
    user: 'TWYSVbUy6eTu6ZrFWRUimgDy9SinkggVKL',
    gasFreeAddress: 'TUgxrm9ynUaPMSbDt65nXbWVD9fYcZyFKk',
    salt: '0x000000000000000000000000e1AB8145F7E55DC933d51a18c793F901A3A0b276',
    bytecodeHash: '0xf69dc6968343dcfb721a1275a476eb0e1c5e8e818865d58bcaecff55dda577f5',
  },
];

export const tronMainnetAddressList = [
  {
    user: 'TMVQGm1qAQYVdetCeGRRkTWYYrLXuHK2HC',
    gasFreeAddress: 'TBwmA2PtMXC4HiGvfi8xg2jZd5i3y89DjK',
    // salt: '',
    // bytecodeHash: '',
  },
  {
    user: 'TDvSsdrNM5eeXNL3czpa6AxLDHZA9nwe9K',
    gasFreeAddress: 'TTA7pGKZdpkJwiwuookcfbkdq6kZxysn86',
    // salt: '',
    // bytecodeHash: '',
  },
  {
    user: 'TKTX96CBxr5kvhjsDHcqoiPWZageGxoTW3',
    gasFreeAddress: 'TJyjjMa8AKvARKyMRNm2JrZ6ftQh3cC6Zg',
    // salt: '',
    // bytecodeHash: '',
  },
  {
    user: 'TCo75zcxTuWn5nnFqZUeK5socdVnG11f2T',
    gasFreeAddress: 'TLCZMcXQuv7A9n1j3L8dTn2rr9oNe2Xqz3',
    // salt: '',
    // bytecodeHash: '',
  },
  {
    user: 'TWYSVbUy6eTu6ZrFWRUimgDy9SinkggVKL',
    gasFreeAddress: 'TVKvPadRp1B5uagKTWi93YrwxfwPGEbbUQ',
    // salt: '',
    // bytecodeHash: '',
  },
];

export const tronShastaAddressList = [
  {
    user: 'TMVQGm1qAQYVdetCeGRRkTWYYrLXuHK2HC',
    gasFreeAddress: 'TX5TyYzg9a15HksNfTkKbEqGxa7UEPuJE8',
  },
  {
    user: 'TDvSsdrNM5eeXNL3czpa6AxLDHZA9nwe9K',
    gasFreeAddress: 'TFPccGHtYiUBF5Gbke8Dnk6x1hUNLDA7Uw',
  },
  {
    user: 'TKTX96CBxr5kvhjsDHcqoiPWZageGxoTW3',
    gasFreeAddress: 'TFcDT19LqyVPkTenvV5yhtidkGxhEKxGmo',
  },
  {
    user: 'TCo75zcxTuWn5nnFqZUeK5socdVnG11f2T',
    gasFreeAddress: 'TAt7QZUsP3d6JopDZLHpqcLRe1hUqPhAaa',
  },
  {
    user: 'TWYSVbUy6eTu6ZrFWRUimgDy9SinkggVKL',
    gasFreeAddress: 'TR1Gq7N1w4W5qo8KefjGtZCDgPoTkYzoam',
  },
];

export const tronMessageList = [
  {
    message: {
      token: toEthAddress('TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf'),
      serviceProvider: toEthAddress('TDbJyQ6g1Lx9BAfEEeN5S5TMjjDRAVFCaA'),
      user: toEthAddress('TMVQGm1qAQYVdetCeGRRkTWYYrLXuHK2HC'),
      receiver: toEthAddress('TJM1BE5wq1VdHh3gwjUeyaVkvZp9DVYCfC'),
      value: '10000',
      maxFee: '2000',
      deadline: '1726207632',
      version: '1',
      nonce: '2',
    },
    encodeMessage: '0x66ddee4970f99745397d1da5037b1af25380b406e58d613e9a4e44c88f53f656',
    permitHash: '0xb1226f3a0b690b04e2c39fac3b58352ed68943a12a54b58035045215aaf0b9b1',
  },
  {
    message: {
      token: toEthAddress('TLBaRhANQoJFTqre9Nf1mjuwNWjCJeYqUL'),
      serviceProvider: toEthAddress('TDbJyQ6g1Lx9BAfEEeN5S5TMjjDRAVFCaA'),
      user: toEthAddress('TDvSsdrNM5eeXNL3czpa6AxLDHZA9nwe9K'),
      receiver: toEthAddress('TLFXfejEMgivFDR2x8qBpukMXd56spmFhz'),
      value: '20000',
      maxFee: '2000',
      deadline: '1726507632',
      version: '1',
      nonce: '3',
    },
    encodeMessage: '0x810698dcc75464432adbb9ee4f3cabeb8340e59b278df4a67799cedcbd4ff2eb',
    permitHash: '0x25c20423c18719438f4d40e6b8fec40ede6b73fb3fa702453ea9bd17dd154fb5',
  },
  {
    message: {
      token: toEthAddress('TVSvjZdyDSNocHm7dP3jvCmMNsCnMTPa5W'),
      serviceProvider: toEthAddress('TDbJyQ6g1Lx9BAfEEeN5S5TMjjDRAVFCaA'),
      user: toEthAddress('TKTX96CBxr5kvhjsDHcqoiPWZageGxoTW3'),
      receiver: toEthAddress('TX7WF4tRGQehC9W88XEEKBhQRkLmAtZqKo'),
      value: '100000',
      maxFee: '2000',
      deadline: '1729507632',
      version: '1',
      nonce: '5',
    },
    encodeMessage: '0x2904790f034a8932b4098421c9a471b340a3801aaaab2e59a70498bb87d680d3',
    permitHash: '0x3d103a6a3407dfe7540696131d7cafc3d41d7d8649b93a95daeee041e66238ce',
  },
  {
    message: {
      token: toEthAddress('TWrZRHY9aKQZcyjpovdH6qeCEyYZrRQDZt'),
      serviceProvider: toEthAddress('TDbJyQ6g1Lx9BAfEEeN5S5TMjjDRAVFCaA'),
      user: toEthAddress('TCo75zcxTuWn5nnFqZUeK5socdVnG11f2T'),
      receiver: toEthAddress('TCN4biEVzzfyUgN1NM8iysp4bYx6mx2gPv'),
      value: '100000',
      maxFee: '2000',
      deadline: '1729517632',
      version: '1',
      nonce: '15',
    },
    encodeMessage: '0x3bf2b313fb43ef51fd25ef50e2ea48471879d1f9db00fcac9b1e7b054e27779d',
    permitHash: '0xa1a612e946ad2fecc8bcd2f93f987c38a06ca4807db7af30442e9308a20234ea',
  },
  {
    message: {
      token: toEthAddress('TDnDyfMigx5nch7cCrtzGSwTXkUBnQJ9Pg'),
      serviceProvider: toEthAddress('TDbJyQ6g1Lx9BAfEEeN5S5TMjjDRAVFCaA'),
      user: toEthAddress('TWYSVbUy6eTu6ZrFWRUimgDy9SinkggVKL'),
      receiver: toEthAddress('TVkoisqxn1SbET8ztcnjqRGAY4npxqDcmv'),
      value: '100000',
      maxFee: '2000',
      deadline: '1729907632',
      version: '1',
      nonce: '50',
    },
    encodeMessage: '0xa2d2ed284f8300560812505b7699d3f9fde3bafacd5444ca3de812705ff2ebbf',
    permitHash: '0xc78d11f0afc5397f9329861888a6724b66fe370f0189e67c39bfad4eeb7ec2a9',
  },
];

export const TRON_DOMAIN_SEPARATOR =
  '0x31a0a46f427dd040c91835228e4555951bde0a894cae6239869bb680ebc6ebea';

export const TRON_EIP712_DOMAIN = {
  name: 'GasFreeController',
  version: 'V1.0.0',
  chainId: Number(TRON_CHAIN_ID.NILE),
  verifyingContract: ethToTronAddress(DefaultChainInfoMap[TRON_CHAIN_ID.NILE].gasFreeController),
};
