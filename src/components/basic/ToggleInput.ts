import { Component } from "../basic/Component";

/**
 * Displays an input that shows a label, and the ability to switch from a to b.
 */
export const ToggleInput = ({
	label: labelText,
	onChange,
	init = false,
}: {
	label: string;
	onChange: (state: boolean) => void;
	init?: boolean;
}): Component => {
	return (parent) => {
		let state = !init;

		const inputContainer = parent.appendChild(
			document.createElement("div")
		);
		inputContainer.style.display = "flex";
		inputContainer.style.flexFlow = "row nowrap";
		inputContainer.style.justifyContent = "flex-start";
		inputContainer.style.alignItems = "stretch";

		const label = inputContainer.appendChild(document.createElement("p"));
		label.innerText = labelText;
		label.style.marginRight = "0.75em";
		label.style.fontWeight = "bold";

		const input = parent.appendChild(document.createElement("div"));
		input.className = "hoverable";
		input.style.display = "flex";
		input.style.flexFlow = "row nowrap";
		input.style.justifyContent = "flex-start";
		input.style.alignItems = "stretch";
		input.style.padding = "0.25em";
		input.style.borderRadius = "500px";
		input.style.backgroundColor = "rgba(var(--select-rgb), 0.5)";
		input.style.cursor = "pointer";

		const thumb = input.appendChild(document.createElement("div"));
		thumb.style.borderRadius = "50%";
		thumb.style.height = "0.75em";
		thumb.style.width = "0.75em";
		thumb.style.transition = "0.3s";

		const changeDispState = () => {
			if (!state) {
				thumb.style.backgroundColor = "var(--active)";
				thumb.style.marginLeft = "1em";
				thumb.style.marginRight = "0em";
			} else {
				thumb.style.backgroundColor = "var(--select)";
				thumb.style.marginLeft = "0em";
				thumb.style.marginRight = "1em";
			}

			state = !state;
		};

		changeDispState();
		input.onclick = () => {
			changeDispState();
			onChange(state);
		};

		return inputContainer;
	};
};
