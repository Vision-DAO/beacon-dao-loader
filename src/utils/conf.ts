// This file contains hard-coded defaults that depend on previous build steps

/**
 * Version variables derived from package.json
 */
declare const __IPFS_VERSION__: string;
declare const __APP_VERSION__: string;

export const IPFS_VERSION = __IPFS_VERSION__;
export const APP_VERSION = __APP_VERSION__;

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
	80001: "0xAA770003C50cdFD8517b1d6BbCbF0518BEA63453",
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
