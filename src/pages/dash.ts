import { IPFSClient } from "ipfs-message-port-client";
import { IPFSCache } from "../utils/ipfs";
import { Scaffold } from "../components/layout/Scaffold";
import { DaoHomePage } from "./dao_home";

/**
 * A component that lets a user interact with a suite of DAO helpers, and then
 * log out at the end.
 */
export const DashboardPage = async (app: HTMLElement, ipfs: IPFSCache, account: string): Promise<void> => {
	// The UI must be dropped and added fully
	const dashboard = app.appendChild(document.createElement("div"));
	dashboard.style.height = "100%";
	dashboard.style.width = "100%";
	dashboard.style.opacity = "0%";
	dashboard.style.transition = "opacity 0.3s";

	await new Promise<void>((resolve) => {
		const pages = {
			"Beacon DAO": {
				component: DaoHomePage(ipfs),
				iconSrc: "assets/icons/home.svg"
			},
			"Wallet": {
				component: DaoHomePage(ipfs),
				iconSrc: "assets/icons/bank.svg"
			},
			"DAO Kernel": {
				component: DaoHomePage(ipfs),
				iconSrc: "assets/icons/chip.svg",
			}
		};

		// Close the page when the user pushes logout
		Scaffold(dashboard, { account, onLogout: () => {
			app.removeChild(dashboard);
			resolve();
		}, pages });

		// Reveal the curtain behind this pages
		app.classList.add("active");
		dashboard.style.opacity = "100%";
	});
};
