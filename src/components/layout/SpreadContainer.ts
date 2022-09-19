import { Component } from "../basic/Component";

/**
 * Renders a flex row that spreads items out horizontally, taking up the entire
 * parent.
 */
export const SpreadContainer: Component = (parent: Node): HTMLElement => {
	const container = parent.appendChild(document.createElement("div"));
	container.style.display = "flex";
	container.style.flexFlow = "row nowrap";
	container.style.justifyContent = "space-between";
	container.style.alignItems = "center";

	return container;
};
