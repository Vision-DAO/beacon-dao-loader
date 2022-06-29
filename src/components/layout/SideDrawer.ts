import blockies from "blockies";
import { Modal } from "./Modal";
import { BrandedButtonNavBar } from "./nav/ButtonedNavBar";
import { Clickable } from "../basic/Clickable";
import { Page } from "./nav/NavBar";
import { openAddress } from "../../utils/eth";
import { APP_VERSION, IPFS_VERSION, NETWORK_NAMES } from "../../utils/conf";

export interface SideDrawerProps {
	/**
	 * The address of the currently logged-in account. Should not change during
	 * the lifetime of the application.
	 */
	account: string,

	/**
	 * What to do when the user clicks the logout button.
	 */
	onLogout: () => void,

	/**
	 * The names of each page for the application, and how to navigate to that
	 * item.
	 */
	pages: { [ name: string ]: Page },
}

/**
 * Renders a navigation bar with clickable buttons for navigation,
 * a currently logged-in user's address, a logout button, and an info button.
 *
 * The node that the component should be contained in.
 */
export const SideDrawer = (parent: Node, props: SideDrawerProps): HTMLElement => {
	// A column containing two main things:
	//
	// - The user info section
	// - The navigation section
	const container = parent.appendChild(document.createElement("div"));
	container.style.display = "flex";
	container.style.flexFlow = "column nowrap";
	container.style.alignItems = "stretch";
	container.style.justifyContent = "flex-start";

	const info = InfoSection(container, props);
	info.style.flexShrink = "1";

	const nav = BrandedButtonNavBar(container, props.pages);
	nav.style.marginTop = "1em";
	
	return container;
};

/**
 * Displays a blocky identicon for a user's avatar, an information button that
 * displays a modal with information about the application, and a logout button.
 */
const InfoSection = (parent: HTMLElement, { account, onLogout }: { account: string, onLogout: () => void } ): HTMLElement => {
	// The info section is columns, one with the blocky profile picture,
	// the other with two rows, one with the address, and the other with the info
	// and logout buttons
	const container = parent.appendChild(document.createElement("div"));
	container.style.display = "flex";
	container.style.flexFlow = "row nowrap";
	container.style.alignItems = "space-between";
	container.style.justifyContent = "flex-start";
	container.style.borderBottom = "1px solid rgba(var(--select-rgb), 0.5)";
	container.style.paddingBottom = "1em";

	// Holds address and action buttons
	const infoContainer = container.appendChild(document.createElement("div"));
	infoContainer.style.display = "flex";
	infoContainer.style.flexFlow = "column nowrap";
	infoContainer.style.alignItems = "flex-end";
	infoContainer.style.justifyContent = "space-between";
	infoContainer.style.color = "var(--select)";
	infoContainer.style.overflow = "hidden";
	infoContainer.style.whiteSpace = "nowrap";

	// Displays user address, and opens the block explorer with their address
	const addrLabel = Clickable(infoContainer.appendChild(
		document.createElement("p")), () =>
		openAddress(window.ethereum, account), true);
	addrLabel.textContent = `@${account}`;
	addrLabel.style.fontFamily = "\"Roboto Mono\", Helvetica, sans-serif";
	addrLabel.style.margin = "0";
	addrLabel.style.textOverflow = "ellipsis";
	addrLabel.style.overflow = "hidden";
	addrLabel.style.flexShrink = "1";
	addrLabel.style.maxWidth = "100%";

	// Displays a logout and info button
	const infoButtonsContainer = infoContainer.appendChild(document.createElement("div"));
	infoButtonsContainer.style.display = "flex";
	infoButtonsContainer.style.flexFlow = "row nowrap";
	infoButtonsContainer.style.alignItems = "center";
	infoButtonsContainer.style.justifyContent = "flex-end";
	infoButtonsContainer.style.marginTop = "0.5em";

	// Items to list on the modal
	const modalDetails = document.createElement("div");
	modalDetails.style.display = "flex";
	modalDetails.style.flexFlow = "column nowrap";
	modalDetails.style.marginTop = "1rem";

	const modalItem = (parent: Node, a: string, b: string) => {
		const container = parent.appendChild(document.createElement("div"));
		container.style.display = "flex";
		container.style.flexFlow = "row nowrap";
		container.style.justifyContent = "space-between";
		container.style.alignItems = "center";
		container.style.opacity = "70%";
		container.style.marginTop = "0.5rem";

		const left = container.appendChild(document.createElement("p"));
		left.textContent = a;
		left.style.margin = "0";

		const right = container.appendChild(document.createElement("p"));
		right.textContent = b;
		right.style.fontWeight = "bold";
		right.style.margin = "0";
	};

	[
		["App Version", APP_VERSION],
		["IPFS Version", IPFS_VERSION],
		[
			"ETH Network",
			window.ethereum.chainId ?
				NETWORK_NAMES[parseInt(window.ethereum.chainId, 16)] : "Not Connected"
		]
	].forEach(([a, b]) => modalItem(modalDetails, a, b));

	const info = Clickable(
		infoButtonsContainer.appendChild(
			document.createElement("img")),
		() => Modal(document.body, { title: "About", children: modalDetails }), true);
	info.src = "assets/icons/info.svg";

	const logout = Clickable(
		infoButtonsContainer.appendChild(document.createElement("img")),
		onLogout, true);
	logout.src = "assets/icons/logout.svg";

	// Create a blockie with an equal width and height
	const createBlockie = (): HTMLCanvasElement => {
		const picRef = container.insertBefore<HTMLCanvasElement>(blockies({ seed: account }), infoContainer);
		const size = picRef.clientHeight;
		container.removeChild(picRef);

		const pic = container.insertBefore<HTMLCanvasElement>(blockies({ seed: account, size: 8, scale: size / 8 }), infoContainer);
		pic.style.marginRight = "1.5em";
		pic.style.borderRadius = "50%";
		pic.style.width = `${size}px`;
		pic.style.height = `${size}px`;

		return Clickable(pic, () => openAddress(window.ethereum, account), true);
	};

	let pic = createBlockie();

	// Resize the blockie avatar each time the window size changes
	const resizeBlockie = () => {
		container.removeChild(pic);
		pic = createBlockie();
	};

	setTimeout(resizeBlockie, 20);
	window.addEventListener("resize", resizeBlockie);

	return container;
};


