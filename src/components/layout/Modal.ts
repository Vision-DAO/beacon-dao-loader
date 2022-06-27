import { Clickable } from "../basic/Clickable";

export interface ModalProps {
	title: string,
	children: HTMLElement,
}

/**
 * A pop-up that dims the rest of the screen, displays a title of the user's
 * choosing, a close button, and further content of the user's choosing.
 */
export const Modal = (parent: Node = document.body, { title, children }: ModalProps): HTMLElement => {
	const container = parent.appendChild(document.createElement("div"));
	container.style.position = "absolute";
	container.style.top = "0";
	container.style.left = "0";
	container.style.right = "0";
	container.style.bottom = "0";
	container.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
	container.style.opacity = "0%";
	container.style.width = "100%";
	container.style.height = "100%";
	container.style.display = "flex";
	container.style.justifyContent = "center";
	container.style.alignItems = "center";
	container.style.transition = "0.3s";
	container.style.zIndex = "2";

	// CSS automatically performs animation, but not without any delay
	setTimeout(() => {
		container.style.opacity = "100%";
	}, 10);

	const close = () => {
		container.style.opacity = "0%";

		setTimeout(() => {
			parent.removeChild(container);
		}, 300);
	};

	const modal = container.appendChild(document.createElement("div"));
	modal.style.background = "linear-gradient(180deg, var(--secondary-bg-color) 0%, var(--secondary-bg-color-darker) 100%)";
	modal.style.border = "0.5px solid var(--main-bg-lightened)";
	modal.style.borderRadius = "10px";
	modal.style.padding = "2rem";
	modal.style.minWidth = "20%";

	const headerContainer = modal.appendChild(document.createElement("div"));
	headerContainer.style.display = "flex";
	headerContainer.style.flexFlow = "row nowrap";
	headerContainer.style.justifyContent = "center";
	headerContainer.style.alignItems = "center";
	modal.style.position = "relative";

	const titleLabel = headerContainer.appendChild(document.createElement("p"));
	titleLabel.textContent = title;
	titleLabel.style.alignSelf = "center";
	titleLabel.style.margin = "0";
	titleLabel.style.fontSize = "2em";

	const closeBtn = Clickable(headerContainer.appendChild(document.createElement("img")), close, true);
	closeBtn.src = "assets/icons/close.svg";
	closeBtn.style.position = "absolute";
	closeBtn.style.right = "2rem";
	closeBtn.style.height = "1.25em";

	modal.appendChild(children);

	return container;
};
