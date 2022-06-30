import { Component } from "./Component";

export const NotFound: Component = (parent): HTMLElement => {
	const container = parent.appendChild(document.createElement("div"));
	container.style.display = "flex";
	container.style.flexFlow = "column nowrap";
	container.style.justifyContent = "center";
	container.style.alignItems = "center";
	container.style.height = "100%";
	container.style.width = "100%";
	container.style.color = "var(--select)";

	const icon = container.appendChild(document.createElement("img"));
	icon.src = "assets/icons/error.svg";

	const title = container.appendChild(document.createElement("h1"));
	title.innerText = "404 Not Found";
	title.style.margin = "0";
	title.style.marginTop = "1em";
	
	const description = container.appendChild(document.createElement("p"));
	description.innerText = "The requested item could not be found. Please try again later.";
	description.style.margin = "0";
	description.style.marginTop = "0.5em";

	return container;
};
