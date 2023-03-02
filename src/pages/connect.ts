import { DEFAULT_NETWORK } from "../utils/conf";
import { ERR_NO_TEMPLATES } from "../utils/common";
import { IPFSClient } from "ipfs-message-port-client";
import { BlockInput } from "../components/basic/BlockInput";
import { ToggleInput } from "../components/basic/ToggleInput";
import { providers, getDefaultProvider } from "ethers";

import { SpreadContainer } from "../components/layout/SpreadContainer";
import LogoSquare from "../components/basic/LogoSquare";
import { ActionableDialogue } from "../components/basic/ActionableDialogue";
import { Dialogue, DialogueStyle } from "../components/basic/Dialogue";
import { Button } from "../components/basic/Button";

/**
 * Renders screens necessary to get a global ethers provier.
 *
 * Returns null if the user has more steps they must complete to finish the flow.
 */
export const ConnectPage = async (
	app: Element,
	eventualIpfs: Promise<IPFSClient>
): Promise<{ ipfs: IPFSClient; provider: providers.Provider } | null> => {
	const connectContainer = app.appendChild(document.createElement("div"));
	connectContainer.classList.add("connectContainer");

	// Show branding info
	const logoSquare = LogoSquare(connectContainer);

	if (logoSquare === null) {
		console.warn(ERR_NO_TEMPLATES);

		return null;
	}

	// Ensure no overlays have been added
	app.classList.remove("active");

	let provider = null;
	let statusMsg = null;

	while (provider === null) {
		// Check for a present Ethereum provider. Present a prompt if it isn't available.
		const { node: connectDialogue, close } = Dialogue(connectContainer, {
			title: "Connect to Vision",
			titleIconSrc: "assets/icons/wifi.svg",
			msg:
				statusMsg ||
				"A connection to the Arbitrum blockchain will be attempted before you can proceed.",
			style: [DialogueStyle.Labeled],
		});

		let rpc = "auto";
		let rpcChoice = "auto";

		// Ask the user which RPC to use
		const netContainer = SpreadContainer(connectDialogue);
		const choiceContainer = netContainer.appendChild(
			document.createElement("div")
		);
		choiceContainer.style.display = "flex";
		choiceContainer.style.flexFlow = "row nowrap";
		choiceContainer.style.justifyContent = "flex-end";
		choiceContainer.style.alignItems = "center";

		const label = choiceContainer.appendChild(document.createElement("p"));
		label.innerText = "Network";

		const input = BlockInput({
			placeholder: "RPC URL",
			onChange: (v) => {
				rpcChoice = v;
				rpc = v;
			},
		})(netContainer);
		input.style.opacity = "0%";

		const node = ToggleInput({
			label: "auto",
			onChange: (v) => {
				if (v) {
					rpc = "auto";
					input.style.opacity = "0%";
				} else {
					rpc = rpcChoice;
					input.style.opacity = "100%";
				}
			},
			init: true,
		})(choiceContainer);
		node.style.marginLeft = "1.25em";

		// Attempt to connect to the indicated RPC node, or display an error
		await new Promise((resolve) => {
			const { setLoading: setConnecting } = Button(connectDialogue, {
				label: "Connect",
				onClick: () => {
					statusMsg = null;
					setConnecting(true);

					try {
						if (rpc === "auto")
							provider = new providers.JsonRpcProvider(
								DEFAULT_NETWORK.rpcUrls[0]
							);
						else provider = new providers.JsonRpcProvider(rpc);
					} catch (e) {
						statusMsg = e;
						provider = null;
					} finally {
						setConnecting(false);
						resolve(null);
						close();
					}
				},
			});
		});
	}

	// Show a prompt telling the user that IPFS is being loaded until it is ready
	const { setLoading } = ActionableDialogue(connectContainer, {
		title: "Connecting to the IPFS Network",
		msg: "The client is currently connecting to the IPFS network. Please wait.",
		btnText: "Go Faster",
		style: [DialogueStyle.Labeled],
		titleIconSrc: "assets/icons/cloud.svg",
	});
	setLoading(true);

	const ipfs = await eventualIpfs;

	app.removeChild(connectContainer);

	return { ipfs, provider };
};
