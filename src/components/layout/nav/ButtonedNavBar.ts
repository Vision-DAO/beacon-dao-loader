import { Clickable } from "../../basic/Clickable";
import { NavBar, Page, NavBarContext } from "./NavBar";

/**
 * Displays a Vision logo, followed by buttons to each of the navigablePages.
 */
export const BrandedButtonNavBar: NavBar = (parent: HTMLElement, pages: { [ name: string ]: Page }): HTMLElement => {
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

	NavBarContext((switchTo) => {
		Object.entries(pages)
			.forEach(([pageName, pageContents], i) => {
				const pageButton = pagesContainer.appendChild(document.createElement("div"));
				pageButton.classList.add("button");
				pageButton.classList.add("secondary");
				pageButton.classList.add("hoverable");
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

				const onActivate = () => {
					// Deactivate other buttons
					switcher();

					// Activate the current button
					pageButton.classList.add("active");
					icon.style.opacity = "0%";
					altIcon.style.opacity = "100%";
					label.style.fontWeight = "bold";

					// Run callback
					pageContents.cb();
				};

				const switcher = switchTo(() => {
					if (pageButton.classList.contains("active"))
						pageContents.onClose();

					pageButton.classList.remove("active");
					icon.style.opacity = "100%";
					altIcon.style.opacity = "0%";
					label.style.fontWeight = "normal";
				});

				Clickable(pageButton, onActivate);

				if (i === 0)
					onActivate();
			});
	});

	return container;
};
