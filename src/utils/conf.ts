// This file contains hard-coded defaults that depend on previous build steps

/**
 * Version variables derived from package.json
 */
declare const __IPFS_VERSION__: string;
declare const __APP_VERSION__: string;
declare const __IPFS_GATEWAY__: string;

export const IPFS_VERSION = __IPFS_VERSION__;
export const APP_VERSION = __APP_VERSION__;
export const IPFS_GATEWAY = __IPFS_GATEWAY__;

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
	421613: "0x91de242e2cce6fa76ba97641ad7e13230f2eb7b4",
};

/**
 * The default metamask network that the user should be connected to if their
 * current network isn't supported.
 */
export const DEFAULT_NETWORK = {
	chainId: "421613",
	chainName: "Arbitrum Testnet",
	nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
	rpcUrls: ["https://goerli-rollup.arbitrum.io/rpc"],
	blockExplorerUrls: ["https://goerli.arbiscan.io/"],
};
