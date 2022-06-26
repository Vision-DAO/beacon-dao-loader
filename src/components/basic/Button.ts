import { Clickable } from "./Clickable";

/**
 * See button docs.
 */
export interface ButtonProps {
	label: string,
	iconSrc?: string,
	onClick?: () => void,
}

/**
 * A component that can be sent into a loading state by calling the setLoading
 * method.
 */
type ButtonComponent = { node: HTMLElement, setLoading: (loading: boolean) => void };

/**
 * A component that renders a button with some text, and with an optional callback.
 */
export const Button = (parent: Element = document.body, { label, iconSrc, onClick }: ButtonProps): ButtonComponent => {
	// A label, and potentially an icon, side by side
	const container = parent.appendChild(document.createElement("div"));
	container.classList.add("button");
	container.style.position = "relative";
	container.style.marginTop = "1rem";
	container.style.width = "100%";
	container.style.display = "flex";
	container.style.flexFlow = "row nowrap";
	container.style.justifyContent = "center";
	container.style.alignItems = "center";
	container.style.setProperty("--passive-color", "var(--active-rgb)");
	container.style.setProperty("--hover-color", "var(--hover-rgb)");
	container.style.color = "var(--main-bg-color)";
	container.style.boxSizing = "border-box";

	const btn = container.appendChild(document.createElement("p"));
	btn.textContent = label;
	btn.style.margin = "0";
	btn.style.transition = "0.3s opacity";

	const makeLoadingIcon = (): HTMLElement => {
		const loadingContainer = container.appendChild(document.createElement("div"));
		loadingContainer.style.position = "absolute";
		loadingContainer.style.opacity = "0";
		loadingContainer.style.transition = "0.3s opacity";
		loadingContainer.style.position = "absolute";
		loadingContainer.style.top = "50%";
		loadingContainer.style.left = "50%";
		loadingContainer.style.transform = "translate(-50%, -50%)";
		loadingContainer.style.width = "100%";
		loadingContainer.style.display = "flex";
		loadingContainer.style.flexFlow = "row nowrap";
		loadingContainer.style.justifyContent = "center";
		loadingContainer.style.alignItems = "center";
		
		for (let i = 0; i < 4; i++) {
			const ball = loadingContainer.appendChild(document.createElement("div"));
			ball.style.animation = "bounce 1.5s infinite ease-in-out";
			ball.style.animationDelay = `${0.5 * i}s`;
			ball.style.backgroundColor = "rgba(var(--main-bg-color-rgb), 0.75)";
			ball.style.height = "0.5em";
			ball.style.width = "0.5em";
			ball.style.borderRadius = "50%";
			ball.style.marginLeft = "0.5em";
			ball.style.marginRight = "0.5em";
		}

		return loadingContainer;
	};

	if (onClick) {
		Clickable(container, onClick);
	}

	let loadingIcon: HTMLElement | null = null;

	const setLoading = (loading: boolean) => {
		// Restore the original contents of the button
		if (!loading) {
			btn.style.opacity = "100%";

			if (loadingIcon)
				loadingIcon.style.opacity = "0";
			container.style.pointerEvents = "auto";
		} else {
			btn.style.opacity = "0";

			if (loadingIcon)
				loadingIcon.style.opacity = "100%";
			container.style.pointerEvents = "none";
		}
	};

	// Show no icon if no src was provided
	if (!iconSrc) {
		// Bind the loading icons now that no extra data needs to be inserted
		loadingIcon = container.appendChild(makeLoadingIcon());

		return { node: container, setLoading };
	}

	const img = container.insertBefore(document.createElement("img"), btn);
	img.setAttribute("src", iconSrc);
	img.style.maxHeight = "1.5em";
	img.style.alignSelf = "stretch";
	img.style.marginRight = "0.75rem";
	img.style.transition = "0.3s opacity";

	const setAllLoading = (loading: boolean) => {
		setLoading(loading);

		if (!loading) {
			img.style.opacity = "100%";
		} else {
			img.style.opacity = "0";
		}
	};

	loadingIcon = container.appendChild(makeLoadingIcon());

	return { node: container, setLoading: setAllLoading };
};
