import { IPFSCache } from "../utils/ipfs";
import {
	IdeaMetaProvider,
	instanceOfPayloadLoader,
	instanceOfPayload,
} from "../utils/idea";
import { networkDeployedDao } from "../utils/eth";
import { blobifyEval } from "../utils/common";
import { ActionableDialogue } from "../components/basic/ActionableDialogue";
import { DialogueStyle } from "../components/basic/Dialogue";
import { NotFound } from "../components/basic/NotFound";
import { contracts, schema } from "beacon-dao";
import { providers } from "ethers";

/**
 * A component that lets a user interact with a suite of DAO helpers, and then
 * log out at the end.
 */
export const DashboardPage = async (
	app: HTMLElement,
	ipfs: IPFSCache,
	provider: providers.Provider
): Promise<void> => {
	// The UI must be dropped and added fully
	const dashboard = app.appendChild(document.createElement("div"));
	dashboard.style.height = "100%";
	dashboard.style.width = "100%";
	dashboard.style.opacity = "0%";
	dashboard.style.transition = "opacity 0.3s";

	// Display a loading icon while the VM is cold-booting
	const { node: loader, setLoading } = ActionableDialogue(dashboard, {
		title: "Connecting to Vision",
		titleIconSrc: "assets/icons/loading.svg",
		msg: "Preparing base Virtual Machine modules. This may take a while.",
		style: [DialogueStyle.Secondary, DialogueStyle.Labeled],
		btnText: "Go Faster!",
	});

	setLoading(true);

	// Reveal the curtain behind this pages
	app.classList.add("active");
	dashboard.style.opacity = "100%";

	const daoAddr = await networkDeployedDao(provider);

	// This will never happen, because the login flow ensures that the user
	// is on a valid network
	if (daoAddr === null) return;

	// Global wrapper for the Idea contract
	const contract = new IdeaMetaProvider(
		contracts.Idea__factory.connect(daoAddr, provider)
	);

	// Displays an informative error message button
	const showError = (title: string, msg: string) => {
		ActionableDialogue(app, {
			title,
			msg,
			style: [DialogueStyle.Warning],
			btnText: "OK",
			onClick: () => window.location.reload(),
		});
	};

	// Starts all of the WASM modules specified as payloads for the given idea
	// metadata
	const spawnWasm = async (metadata: schema.IdeaMetadata) => {
		for (const cid of metadata.payload) {
			const payload: schema.IdeaPayload | null = await ipfs.get(cid);

			if (payload === null) {
				console.error("Beacon DAO: Failed to load.");
				NotFound(app);

				return;
			}

			// Use the loader to start the WASM module
			const maybeLoader = await import(
				/* webpackIgnore: true */ blobifyEval(payload.loader)
			);
			if (!instanceOfPayloadLoader(maybeLoader)) {
				console.error("Beacon DAO: Invalid payload loader.");
				showError(
					"Broken Loader",
					"The Beacon DAO did not provide a working loader. Please try again later, or contact a DAO member."
				);

				return;
			}

			const loader: schema.PayloadLoader = maybeLoader;

			const module = await loader.default(new Uint8Array(payload.module));
			if (!instanceOfPayload(module)) {
				console.error("Beacon DAO: Could not load module.");
				showError(
					"Broken App",
					"An app installed by the Beacon DAO is not working. Please try again later, or contact a DAO member."
				);

				return;
			}

			module.start();
		}

		// Remove loading indicator now that initial load is done
		setLoading(false);
		loader.style.opacity = "0%";
		setTimeout(() => dashboard.removeChild(loader), 300);
	};

	// Start the modules specified by the contract
	const meta = await ipfs.getMeta<schema.IdeaMetadata>(contract);

	if (meta !== null) spawnWasm(meta);

	// Listen to live updates to the code specified by the Beacon DAO
	ipfs.onMeta<schema.IdeaMetadata>(contract, spawnWasm);

	// TODO: Logout system call
	await new Promise<void>(() => ({}));
};
