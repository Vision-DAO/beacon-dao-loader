import { DEPLOYED_CONTRACTS } from "../utils/conf";
import { METAMASK_SITE, ERR_NO_TEMPLATES } from "../utils/common";
import { addAndChangeNetwork, login } from "../utils/eth";
import { IPFSClient } from "ipfs-message-port-client";

import LogoSquare from "../components/basic/LogoSquare";
import { ActionableDialogue, DialogueStyle, DialogueComponent } from "../components/basic/ActionableDialogue";

/**
 * Renders screens necessary to get the user's logged-in account.
 *
 * Returns null if the user has more steps they must complete to finish the flow.
 */
export const LoginPage = async (app: Element, eventualIpfs: Promise<IPFSClient>): Promise<{ account: string, ipfs: IPFSClient } | null> => {
	const loginContainer = app.appendChild(document.createElement("div"));
	loginContainer.classList.add("loginContainer");

	// Show branding info
	const logoSquare = LogoSquare(loginContainer);

	if (logoSquare === null) {
		console.warn(ERR_NO_TEMPLATES);

		return null;
	}

	// Ensure no overlays have been added
	app.classList.remove("active");

	// Check for a present Ethereum provider. Present a prompt if it isn't available.
	if (window.ethereum === undefined) {
		ActionableDialogue(loginContainer,
			{
				title: "No Ethereum Connection",
				msg: "Please install an Ethereum wallet. Most users use Metamask.",
				onClick: () => window.location.assign(METAMASK_SITE),
				btnText: "Install Metamask",
				style: DialogueStyle.Warning
			}
		);

		// No further action required until ethereum is available
		return null;
	}

	// Make sure we can actually use the blockchain. Otherwise require reload
	if (!window.ethereum.isConnected()) {
		ActionableDialogue(loginContainer,
			{
				title: "Unable to Communicate with Blockchain",
				msg: "Your wallet was unable to form a connection with a blockchain. Please try again later.",
				onClick: () => window.location.reload(),
				btnText: "Reload",
				style: DialogueStyle.Warning
			}
		);

		return null;
	}

	// Show a prompt telling the user that IPFS is being loaded until it is ready
	const { node, setLoading } = ActionableDialogue(loginContainer,
		{
			title: "Connecting to the IPFS Network",
			msg: "The client is currently connecting to the IPFS network. Please wait.",
			btnText: "Go Faster",
			style: DialogueStyle.Labeled,
			titleIconSrc: "assets/icons/cloud.svg",
		});
	setLoading(true);

	const ipfs = await eventualIpfs;
	loginContainer.removeChild(node);

	let loginButton: DialogueComponent | null = null;

	let account = null;

	// Check that the user has granted us access to ONE of their accounts.
	// Handle switching to another account later
	while (account === null) {
		if (loginButton !== null) {
			document.body.removeChild(loginButton["node"]);
		}

		// Request access to the user's account through a login button
		await new Promise<void>((resolve) => {
			loginButton = ActionableDialogue(loginContainer,
				{
					title: "Login with Metamask",
					msg: "We need to know who you are to proceed. Continue in your wallet.",
					titleIconSrc: "assets/icons/workbadge.svg",
					btnIconSrc: "assets/icons/MetaMask_Fox.svg.png",
					btnText: "Sign In",
					onClick: async () => {
						if (loginButton)
							loginButton.setLoading(true);

						const accounts = await login(window.ethereum);

						if (accounts.length != 0)
							account = accounts[0];

						resolve();

						if (loginButton)
							loginButton.setLoading(false);
					},
					style: DialogueStyle.Labeled,
				});
		});
	}

	if (loginButton)
		loginContainer.removeChild(loginButton["node"]);

	// Listen for future updates to the active account by just reloading the page
	window.ethereum.on("accountsChanged", () => {
		window.location.reload();
	});

	let networkPrompt: DialogueComponent | null = null;

	// Creates a new promise that waits for the next time the client switches
	// Ethereum chains
	const netSwitched: () => Promise<void> = () => new Promise<void>((resolve) => {
		window.ethereum.once("chainChanged", () => resolve());
	});

	// Check that the user is on a supported blockchain. If not, allow them to
	// switch
	while (window.ethereum.chainId == null || !(Number(window.ethereum.chainId).toString(10) in DEPLOYED_CONTRACTS)) {
		if (networkPrompt === null) {
			// Allow the user to click a button to change their network, and register
			// an event listener for when that happens to refresh the page.
			networkPrompt = ActionableDialogue(loginContainer,
				{
					title: "Unsupported Network",
					msg: "Vision isn't supported for your selected blockchain yet. Connect to Polygon, one of our supported networks, to continue.",
					btnText: "Connect to Polygon",
					onClick: async () => {
						if (networkPrompt)
							networkPrompt.setLoading(true);

						await addAndChangeNetwork(window.ethereum);
					},
					style: DialogueStyle.Warning,
				}
			);
		}

		await netSwitched();
		networkPrompt.setLoading(false);
	}

	// The user has escaped from the infinite account switcher
	if (networkPrompt)
		loginContainer.removeChild(networkPrompt.node);

	// Require a restart if they change again
	window.ethereum.on("chainChanged", () => window.location.reload());

	// Done with logging in
	app.removeChild(loginContainer);

	return { account, ipfs };
};
