import { IPFSCache } from "../utils/ipfs";
import { Scaffold } from "../components/layout/Scaffold";
import { DaoHomePage } from "./dao_home";
import { networkDeployedDao } from "../utils/eth";
import { IdeaMetaProvider } from "../utils/idea";
import { Idea__factory } from "beacon-dao";
import { providers } from "ethers";

/**
 * A component that lets a user interact with a suite of DAO helpers, and then
 * log out at the end.
 */
export const DashboardPage = async (app: HTMLElement, ipfs: IPFSCache, account: string): Promise<void> => {
	// Wonky cast due to metamask type declaration, but this should work.
	const provider = new providers.Web3Provider(window.ethereum as unknown as providers.ExternalProvider);

	// The UI must be dropped and added fully
	const dashboard = app.appendChild(document.createElement("div"));
	dashboard.style.height = "100%";
	dashboard.style.width = "100%";
	dashboard.style.opacity = "0%";
	dashboard.style.transition = "opacity 0.3s";

	const daoAddr = networkDeployedDao(window.ethereum);

	// This will never happen, because the login flow ensures that the user
	// is on a valid network
	if (daoAddr === null)
		return;

	// Global wrapper for the Idea contract
	const contract = new IdeaMetaProvider(Idea__factory.connect(daoAddr, provider));

	await new Promise<void>((resolve) => {
		const pages = {
			"Beacon DAO": {
				component: DaoHomePage(contract, ipfs),
				iconSrc: "assets/icons/home.svg"
			},
			"Wallet": {
				component: DaoHomePage(contract, ipfs),
				iconSrc: "assets/icons/bank.svg"
			},
			"DAO Kernel": {
				component: DaoHomePage(contract, ipfs),
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
