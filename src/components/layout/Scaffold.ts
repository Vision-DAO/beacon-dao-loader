import { NavBar, NavBarProps } from "./NavBar";

export interface ScaffoldProps {
	navProps: NavBarProps
}

/**
 * A component that renders workspace with an adjacent panel, where the
 * adjacent panel is a navigation bar.
 */
export const Scaffold = (parent: HTMLElement, { navProps }: ScaffoldProps): HTMLElement => {
	const workspaceContainer = parent.appendChild(document.createElement("div"));
	workspaceContainer.style.display = "flex";
	workspaceContainer.style.flexFlow = "row nowrap";
	workspaceContainer.style.justifyContent = "space-between";
	workspaceContainer.style.alignItems = "flex-start";
	workspaceContainer.style.width = "100%";
	workspaceContainer.style.height = "100%";

	const nav = NavBar(workspaceContainer, navProps);
	nav.style.width = "15%";

	return workspaceContainer;
};
