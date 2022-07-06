import { MetaMaskInpageProvider } from "@metamask/providers";

import { IPFSClient } from "ipfs-message-port-client";
import { IPFSCache } from "./utils/ipfs";
import { createLibp2p } from "libp2p";
import { WebSockets } from "@libp2p/websockets";
import { WebRTCStar } from "@libp2p/webrtc-star";
import { Noise } from "@chainsafe/libp2p-noise";
import { Mplex } from "@libp2p/mplex";
import { KadDHT } from "@libp2p/kad-dht";
import { Bootstrap } from "@libp2p/bootstrap";
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
	let ipfs: IPFSCache | undefined = undefined;
	const webRtcStar = new WebRTCStar();
	const gLibp2p = createLibp2p({
		addresses: {
			listen: [
				"/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
				"/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
			],
		},
		transports: [
			new WebSockets(),
			webRtcStar,
		],
		connectionEncryption: [new Noise()],
		streamMuxers: [new Mplex()],
		peerDiscovery: [
			webRtcStar.discovery,
			new Bootstrap({
				list: [
					"/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
					"/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
					"/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp",
					"/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
					"/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
				],
			})
		],
		dht: new KadDHT(),
	});

	// Load an alternative HTTP-based client in testing environments only
	if (__IPFS_NODE__) {
		const { create } = await import("ipfs-http-client");

		gIpfs = new Promise<IPFSClient>(
			(resolve) => resolve(create({ url: __IPFS_NODE__ }) as unknown as IPFSClient)
		);
	} else {
		// Run IPFS in a web worker to prevent main from blocking. This reduces
		// load times, because IPFS can do its thing in the background, and we can
		// check if it's done later.
		const worker = new SharedWorker(new URL("./utils/ipfs.worker.ts", import.meta.url));
		gIpfs = new Promise<IPFSClient>((resolve) => {
			resolve(IPFSClient.from(worker.port));
		});
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
		const res = await LoginPage(app, gIpfs, gLibp2p);

		if (res === null)
			return null;

		const { account, ipfs: rawIpfs, libp2p } = res;

		if (!ipfs)
			ipfs = new IPFSCache(rawIpfs);

		// Wait until the user logs out, then start the log in process again
		await DashboardPage(app, ipfs, libp2p, account);
	}
})();
