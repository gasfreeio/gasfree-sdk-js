import { TRON_CHAIN_ID } from '../constant/common';

describe('test constant', () => {
  it('test TRON chainId', () => {
    expect(TRON_CHAIN_ID.MAINNET).toBe(728126428);
    expect(TRON_CHAIN_ID.SHASTA).toBe(2494104990);
    expect(TRON_CHAIN_ID.NILE).toBe(3448148188);
  });
});
