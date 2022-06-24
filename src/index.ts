import { create } from "ipfs-core";
import { MetaMaskInpageProvider } from "@metamask/providers";

import LogoSquare from "./LogoSquare";

/**
 * Addresses of Ethereum Beacon DAO's deployed on different chains.
 */
const DEPLOYED_CONTRACTS: { [chainId: number]: string } = {
	80001: "0xEfa56061B06aC1481E1B30e30E8617f2E18d0907"
};

const ERR_NO_TEMPLATES = "Client does not support HTML templates.";

/**
 * Satisfy typescript wanting typings for the window.ethereum instance.
 */
declare global {
	interface Window {
		ethereum: MetaMaskInpageProvider;
	}
}

(async () => {
	// Use one global IPFS instance
	const ipfs = await create();

	// Show branding info
	const logoSquare = LogoSquare();

	if (logoSquare === null) {
		console.warn(ERR_NO_TEMPLATES);

		return;
	}

	// Check for a present Ethereum provider. Present a prompt if it isn't available.
	if (window.ethereum === undefined) {
	}
});
