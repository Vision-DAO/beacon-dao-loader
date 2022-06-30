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
	container.style.paddingBottom = "1em";
	container.style.borderBottom = "1px solid rgba(var(--select-rgb), 0.5)";

	// Create a button for toggling to each of the specified pages
	NavBarContext((switchMaker) => {
		Object.entries(pages).forEach(([name, { cb, onClose }], i) => {
			const btn = container.appendChild(document.createElement("p"));
			btn.classList.add("tab-nav-item");
			btn.innerText = name;
			btn.style.margin = "0";
			btn.style.fontSize = "1.75em";
			btn.style.marginRight = "1.5em";

			const deactivateOtherBtns = switchMaker(() => {
				if (btn.classList.contains("active"))
					onClose();

				btn.classList.remove("active");
			});

			const onActivate = () => {
				deactivateOtherBtns();
				btn.classList.add("active");
				cb();
			};

			Clickable(btn, () => {
				onActivate();
			}, true);

			if (i === 0)
				onActivate();
		});
	});

	return container;
};
