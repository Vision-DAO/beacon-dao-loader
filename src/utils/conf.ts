// This file contains hard-coded defaults that depend on previous build steps

/**
 * Version variables derived from package.json
 */
declare const __IPFS_VERSION__: string;
declare const __APP_VERSION__: string;
declare const __IPFS_GATEWAY__: string;
declare const __ARB_DEPLOYED__: string;

export const IPFS_VERSION = __IPFS_VERSION__;
export const APP_VERSION = __APP_VERSION__;
export const IPFS_GATEWAY = __IPFS_GATEWAY__;
export const ARB_DEPLOYED = __ARB_DEPLOYED__;

/**
 * Miliseconds between calls to runtime poll()
 */
export const RT_LATENCY = 1;

/**
 * Human-readable equivalents for supported networks.
 */
export const NETWORK_NAMES: { [chainId: number]: string } = {
	80001: "Mumbai",
};

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
	42161: ARB_DEPLOYED,
	421613: "0x970b4b5a421555142837d8b81b351cac62c90c26",
};

/**
 * The default metamask network that the user should be connected to if their
 * current network isn't supported.
 */
export const DEFAULT_NETWORK = {
	chainId: "42161",
	chainName: "Arbitrum One",
	nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
	rpcUrls: ["https://endpoints.omniatech.io/v1/arbitrum/one/public"],
	blockExplorerUrls: ["https://arbiscan.io/"],
};
