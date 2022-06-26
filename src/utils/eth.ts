import { MetaMaskInpageProvider } from "@metamask/providers";
import { DEFAULT_NETWORK, EXPLORER_URLS } from "./conf";

/**
 * Opens the etherscan page for an address.
 */
export const openAddress = (eth: MetaMaskInpageProvider, address: string) => {
	const net = eth.chainId && parseInt(eth.chainId);

	if (!net || !(net in EXPLORER_URLS))
		return;

	window.open(`${EXPLORER_URLS[net]}/address/${address}`, "_blank");
};

/**
 * Connects the user to the polygon mumbai testnet.
 *
 * Returns false if an error occurred.
 */
export const addAndChangeNetwork = async (eth: MetaMaskInpageProvider): Promise<boolean> => {
	try {
		await eth.request({
			method: "wallet_addEthereumChain",
			params: [DEFAULT_NETWORK]
		});

		await eth.request({
			method: "wallet_switchEthereumChain",
			params: [{
				chainId: DEFAULT_NETWORK.chainId,
			}],
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
		return (await eth.request({ method: "eth_requestAccounts" })) as string[];
	} catch (e) {
		console.warn(e);

		return [];
	}
};
