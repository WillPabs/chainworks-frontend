export const isTestnet = window.location.search.includes('chain=testnet');
export const isMocknet = !isTestnet && window.location.search.includes('mocknet=local');
export const isMainnet =
  (!isTestnet && !isMocknet) || window.location.search.includes('chain=mainnet');