import { toEthAddress } from '../utils';

describe('test tron_to_eth_address', () => {
  it('test tron address situation', () => {
    const tronAddress = 'TWrmALWKr7wsDQBpBoX2WGEPSSqHcUqeHo';
    const ethAddress = toEthAddress(tronAddress);
    expect(ethAddress).toBe('0xe52293550118e61Dc99A79F0043A55Ce7B9F178a');

    const dulEthAddress = toEthAddress(ethAddress);
    expect(dulEthAddress).toBe(ethAddress);
  });
});
