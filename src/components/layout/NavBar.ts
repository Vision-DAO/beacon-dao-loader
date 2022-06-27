import blockies from "blockies";
import { Clickable } from "../basic/Clickable";
import { Modal } from "./Modal";
import { openAddress } from "../../utils/eth";
import { APP_VERSION, IPFS_VERSION, NETWORK_NAMES } from "../../utils/conf";

export interface Page {
	cb: () => void,
	onClose: () => void,
	iconSrc: string,
}

export interface NavBarProps {
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
export const NavBar = (parent: HTMLElement, props: NavBarProps): HTMLElement => {
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

	const nav = NavSection(container, { pages: props.pages });
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

/**
 * Displays a Vision logo, followed by buttons to each of the navigablePages.
 */
export const NavSection = (parent: HTMLElement, { pages }: { pages: { [ name: string ]: Page }}): HTMLElement => {
	// The logo and buttons
	const container = parent.appendChild(document.createElement("div"));
	container.style.display = "flex";
	container.style.flexFlow = "column nowrap";
	container.style.justifyContent = "flex-start";
	container.style.alignItems = "stretch";

	const logo = container.appendChild(document.createElement("img"));
	logo.src = "assets/Vision_Logomark.png";
	logo.style.width = "100%";
	logo.style.filter = "invert(1)";

	const pagesContainer = container.appendChild(document.createElement("div"));
	pagesContainer.style.display = "flex";
	pagesContainer.style.flexFlow = "column nowrap";
	pagesContainer.style.justifyContent = "flex-start";
	pagesContainer.style.alignItems = "stretch";
	pagesContainer.style.marginTop = "2em";

	// Allow each button to receive an event informing them that the active page
	// has changed, which updates their state accordingly
	const changePageListeners: ((page: string) => void)[] = [];

	// Informs all page buttons that the page has changed
	const emitPageChange = (page: string) => {
		changePageListeners.forEach((fn) => fn(page));
	};

	for (const [pageName, pageContents] of Object.entries(pages)) {
		const pageButton = Clickable(pagesContainer.appendChild(document.createElement("div")), () => { emitPageChange(pageName); pageContents.cb(); }, true);
		pageButton.classList.add("button");
		pageButton.classList.add("secondary");
		pageButton.style.position = "relative";
		pageButton.style.display = "flex";
		pageButton.style.flexFlow = "row nowrap";
		pageButton.style.justifyContent = "flex-start";
		pageButton.style.alignItems = "center";
		pageButton.style.marginBottom = "0.75em";
		pageButton.style.paddingLeft = "1.5em";
		pageButton.style.paddingRight = "1.5em";
		pageButton.style.paddingTop = "1em";
		pageButton.style.paddingBottom = "1em";

		const iconSwitcher = pageButton.appendChild(document.createElement("div"));
		iconSwitcher.style.width = "2.5em";
		iconSwitcher.style.position = "relative";

		const icon = iconSwitcher.appendChild(document.createElement("img"));
		icon.src = pageContents.iconSrc;
		icon.style.filter = "invert(1)";
		icon.style.height = "2.5em";
		icon.style.position = "relative";
		icon.style.top = "0";
		icon.style.left = "0";

		const altIcon = iconSwitcher.appendChild(document.createElement("img"));
		altIcon.style.position = "absolute";
		altIcon.style.left = "0";
		altIcon.style.top = "0";
		altIcon.style.bottom = "0";
		altIcon.style.opacity = "0%";
		altIcon.style.filter = "invert(8%) sepia(60%) saturate(4336%) hue-rotate(264deg) brightness(108%) contrast(113%)";
		altIcon.style.height = "2.5em";
		altIcon.src = pageContents.iconSrc;

		const label = pageButton.appendChild(document.createElement("p"));
		label.textContent = pageName;
		label.style.textTransform = "none";
		label.style.fontWeight = "normal";
		label.style.margin = "0";
		label.style.marginLeft = "1em";
		label.style.fontSize = "1.25em";

		changePageListeners.push((page: string) => {
			if (page === pageName) {
				pageButton.classList.add("active");
				icon.style.opacity = "0%";
				altIcon.style.opacity = "100%";
				label.style.fontWeight = "bold";
			} else {
				if (pageButton.classList.contains("active"))
					pageContents.onClose();

				pageButton.classList.remove("active");
				icon.style.opacity = "100%";
				altIcon.style.opacity = "0%";
				label.style.fontWeight = "normal";
			}
		});
	}

	// Consider the first page the default
	emitPageChange(Object.keys(pages)[0]);

	return container;
};
