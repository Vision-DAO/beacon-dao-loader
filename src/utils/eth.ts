import { MetaMaskInpageProvider } from "@metamask/providers";
import { DEFAULT_NETWORK, EXPLORER_URLS, DEPLOYED_CONTRACTS } from "./conf";
import { providers } from "ethers";

/**
 * Gets the URL of the network's explorer, or returns null.
 */
export const networkExplorer = (eth: MetaMaskInpageProvider): string | null => {
	const net = eth.chainId && parseInt(eth.chainId);

	if (!net || !(net in EXPLORER_URLS)) return null;

	return EXPLORER_URLS[net];
};

/**
 * Gets the address of the deployed Beacon DAO on the current network.
 */
export const networkDeployedDao = async (
	eth: providers.Provider
): Promise<string | null> => {
	const chain = await eth.getNetwork();

	if (chain === null) return null;

	if (!(chain.chainId in DEPLOYED_CONTRACTS)) return null;

	return DEPLOYED_CONTRACTS[chain.chainId];
};

/**
 * Opens the etherscan page for an address.
 */
export const openAddress = (eth: MetaMaskInpageProvider, address: string) => {
	const net = eth.chainId && parseInt(eth.chainId);

	if (!net || !(net in EXPLORER_URLS)) return;

	window.open(`${EXPLORER_URLS[net]}/address/${address}`, "_blank");
};

/**
 * Connects the user to the Arbitrum testnet.
 *
 * Returns false if an error occurred.
 */
export const addAndChangeNetwork = async (
	eth: MetaMaskInpageProvider
): Promise<boolean> => {
	try {
		await eth.request({
			method: "wallet_addEthereumChain",
			params: [DEFAULT_NETWORK],
		});

		await eth.request({
			method: "wallet_switchEthereumChain",
			params: [
				{
					chainId: DEFAULT_NETWORK.chainId,
				},
			],
		});

		return true;
	} catch (e) {
		console.warn(e);

		return false;
	}
};

/**
 * Requests the list of accounts that the user is logged in to.
 */
export const login = async (eth: MetaMaskInpageProvider): Promise<string[]> => {
	try {
		return (await eth.request({
			method: "eth_requestAccounts",
		})) as string[];
	} catch (e) {
		console.warn(e);

		return [];
	}
};
