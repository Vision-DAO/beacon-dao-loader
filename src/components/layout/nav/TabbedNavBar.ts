import { NavBar } from "./NavBar";
import { Clickable } from "../../basic/Clickable";
import { NavBarContext } from "./NavBar";

/**
 * Renders a horizontal container displaying a list of clickable pages
 * triggering toggles between the specified pages.
 */
export const TabbedNavBar: NavBar = (parent, pages): HTMLElement => {
	const container = parent.appendChild(document.createElement("div"));
	container.style.display = "flex";
	container.style.flexFlow = "row nowrap";
	container.style.justifyContent = "flex-start";
	container.style.alignItems = "center";

	// Create a button for toggling to each of the specified pages
	NavBarContext((switchMaker) => {
		Object.entries(pages).forEach(([name, { cb, onClose }]) => {
			const btn = container.appendChild(document.createElement("p"));
			btn.innerText = name;

			const deactivateOtherBtns = switchMaker(() => {
				if (btn.classList.contains("active"))
					onClose();

				btn.classList.remove("active");
				btn.style.fontWeight = "normal";
			});

			Clickable(btn, () => {
				deactivateOtherBtns();
				btn.classList.add("active");
				cb();
			}, true);
		});
	});

	return container;
};
