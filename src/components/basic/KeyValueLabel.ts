import { Component } from "./Component";

/**
 * A component that renders a dark attribute label with a key on the left side
 * and a value on the right side.
 */
export const KeyValueLabel = (key: Component, value: Component): Component =>
	(parent: Node): HTMLElement => {
		const container = parent.appendChild(document.createElement("div"));
		container.style.display = "flex";
		container.style.justifyContent = "space-between";
		container.style.alignItems = "center";
		container.style.backgroundColor = "var(--secondary-bg-color-darker)";
		container.style.borderRadius = "5px";
		container.style.paddingLeft = "1em";
		container.style.paddingRight = "1em";
		container.style.paddingTop = "1.25em";
		container.style.paddingBottom = "1.25em";

		const keyLabel = key(container);
		keyLabel.style.color = "rgba(var(--primary-rgb), 0.8)";
		keyLabel.style.whiteSpace = "nowrap";
		keyLabel.style.fontSize = "1.25em";
		keyLabel.style.margin = "0";
		keyLabel.style.marginRight = "5em";

		const valLabel = value(container);
		valLabel.style.whiteSpace = "nowrap";
		valLabel.style.color = "rgba(var(--primary-rgb), 0.8)";
		valLabel.style.overflow = "hidden";
		valLabel.style.textOverflow = "ellipsis";
		valLabel.style.fontSize = "1.25em";
		valLabel.style.margin = "0";

		return container;
	};
