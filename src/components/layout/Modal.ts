export interface ModalProps {
	title: string,
	children: HTMLElement[],
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
	container.style.backgroundColor = "black";
	container.style.opacity = "70%";
	container.style.width = "100%";
	container.style.height = "100%";
	container.style.display = "flex";
	container.style.justifyContent = "center";
	container.style.alignItems = "center";

	const modal = container.appendChild(document.createElement("div"));
	modal.style.backgroundColor = "var(--main-bg-color)";
	modal.style.borderRadius = "10%";

	const headerContainer = modal.appendChild(document.createElement("div"));
	headerContainer.style.display = "flex";
	headerContainer.style.flexFlow = "row nowrap";

	return container;
};
