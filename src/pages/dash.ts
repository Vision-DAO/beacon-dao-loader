import { IPFSClient } from "../utils/ipfs";

/**
 * A component that lets a user interact with a suite of DAO helpers, and then
 * log out at the end.
 */
export const DashboardPage = async (app: HTMLElement, ipfs: IPFSClient, account: string): Promise<void> => {
	// Reveal the curtain behind this pages
	app.classList.add("active");

	await new Promise<void>((resolve) => setTimeout(() => resolve(), 5000));
};
