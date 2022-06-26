// This file contains hard-coded defaults that depend on previous build steps

/**
 * Explorer URLs for each supported blockchain.
 */
export const EXPLORER_URLS: { [chainId: number]: string } = {
	80001: "https://mumbai.polygonscan.com/",
};

/**
 * Addresses of Ethereum Beacon DAO's deployed on different chains.
 */
export const DEPLOYED_CONTRACTS: { [chainId: number]: string } = {
	80001: "0xEfa56061B06aC1481E1B30e30E8617f2E18d0907",
};

/**
 * The default metamask network that the user should be connected to if their
 * current network isn't supported.
 */
export const DEFAULT_NETWORK = {
	chainId: "0x13881",
	chainName: "Polygon Testnet",
	nativeCurrency: { name: "Polygon", symbol: "MATIC", decimals: 18 },
	rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
	blockExplorerUrls: ["https://mumbai.polygonscan.com"] 
};
