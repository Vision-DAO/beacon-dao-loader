import { IPFSClient } from "../utils/ipfs";
import { Scaffold } from "../components/layout/Scaffold";

/**
 * A component that lets a user interact with a suite of DAO helpers, and then
 * log out at the end.
 */
export const DashboardPage = async (app: HTMLElement, ipfs: IPFSClient, account: string): Promise<void> => {
	// Reveal the curtain behind this pages
	app.classList.add("active");

	// The UI must be dropped and added fully
	const dashboard = app.appendChild(document.createElement("div"));
	dashboard.style.height = "100%";
	dashboard.style.width = "100%";

	await new Promise<void>((resolve) => {
		const pages = {
			"Beacon DAO": {
				cb: () => console.log("TODO"),
				iconSrc: "assets/icons/home.svg"
			},
			"Wallet": {
				cb: () => console.log("TODO"),
				iconSrc: "assets/icons/bank.svg"
			},
			"DAO Kernel": {
				cb: () => console.log("TODO"),
				iconSrc: "assets/icons/chip.svg",
			}
		};

		// Close the page when the user pushes logout
		Scaffold(dashboard, { navProps: { account, onLogout: () => {
			app.removeChild(dashboard);
			resolve();
		}, pages} });
	});
};
