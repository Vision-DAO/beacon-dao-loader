import { MetaMaskInpageProvider } from "@metamask/providers";

import { IPFSClient } from "ipfs-message-port-client";
import { IPFSCache } from "./utils/ipfs";
import { ConnectPage } from "./pages/connect";
import { DashboardPage } from "./pages/dash";

import "./styles/index.css";

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
	let ipfs: IPFSCache | undefined = undefined;

	// Load an alternative HTTP-based client in testing environments only
	// Run IPFS in a web worker to prevent main from blocking. This reduces
	// load times, because IPFS can do its thing in the background, and we can
	// check if it's done later.
	const worker = new SharedWorker(
		new URL("./utils/ipfs.worker.ts", import.meta.url)
	);
	gIpfs = new Promise<IPFSClient>((resolve) => {
		resolve(IPFSClient.from(worker.port));
	});

	// Use one global address for the user's logged in account
	const app = document.querySelector(".app") as HTMLElement;
	app.style.transition = "0.3s";

	if (app === null) return;

	// The user will continuously log in and log out for all of eternity
	for (;;) {
		// Run the user through a flow to get their active account information, and
		// get their consent. Leave them on a screen if they get stuck in the flow
		// This screen should be descriptive enough and give the user continuity
		// anyway through navigation items on it
		const res = await ConnectPage(app, gIpfs);

		if (res === null) return null;

		const { ipfs: rawIpfs, provider } = res;

		if (!ipfs) ipfs = new IPFSCache(rawIpfs);

		// Wait until the user logs out, then start the log in process again
		await DashboardPage(app, ipfs, provider);
	}
})();
