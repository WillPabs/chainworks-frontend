import {
    createStacksPrivateKey,
    getPublicKey,
    addressFromPublicKeys,
    AddressVersion,
    AddressHashMode,
  } from '@stacks/transactions';

export const isTestnet = window.location.search.includes('chain=testnet');
export const isMocknet = !isTestnet && window.location.search.includes('mocknet=local');
  
  export function getStacksAccount(appPrivateKey) {
    const privateKey = createStacksPrivateKey(appPrivateKey);
    const publicKey = getPublicKey(privateKey);
    const address = addressFromPublicKeys(
      isTestnet || isMocknet ? AddressVersion.TestnetSingleSig : AddressVersion.MainnetSingleSig,
      AddressHashMode.SerializeP2PKH,
      1,
      [publicKey]
    );
    return { privateKey, address };
  }