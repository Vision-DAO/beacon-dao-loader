import { create } from "ipfs-core";
import { MetaMaskInpageProvider } from "@metamask/providers";

import { IPFSClient } from "./utils/ipfs";
import { LoginPage } from "./pages/login";
import { DashboardPage } from "./pages/dash";

import "./styles/index.css";

/**
 * Used for testing with one single IPFS node per-run.
 */
declare const __IPFS_NODE__: undefined | string;

/**
 * Satisfy typescript wanting typings for the window.ethereum instance.
 */
declare global {
	interface Window {
		ethereum: MetaMaskInpageProvider;
	}
}

(async () => {
	// Use one global IPFS instance. Load it in later if it hasn't loaded yet
	let gIpfs: Promise<IPFSClient>;

	// Load an alternative HTTP-based client in testing environments only
	if (__IPFS_NODE__) {
		const { create } = await import("ipfs-http-client");

		gIpfs = new Promise<IPFSClient>(
			(resolve) => resolve(create({ url: __IPFS_NODE__ }) as unknown as IPFSClient)
		);
	} else {
		gIpfs = create();
	}

	// Use one global address for the user's logged in account
	const app = document.querySelector(".app") as HTMLElement;
	app.style.transition = "0.3s";

	if (app === null)
		return;

	// The user will continuously log in and log out for all of eternity
	for(;;) {
		// Run the user through a flow to get their active account information, and
		// get their consent. Leave them on a screen if they get stuck in the flow
		// This screen should be descriptive enough and give the user continuity
		// anyway through navigation items on it
		const res = await LoginPage(app, gIpfs);

		if (res === null)
			return null;

		const { account, ipfs } = res;

		// Wait until the user logs out, then start the log in process again
		await DashboardPage(app, ipfs, account);
	}
})();
