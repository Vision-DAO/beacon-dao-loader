import { SideDrawer } from "./SideDrawer";
import { Page } from "./nav/NavBar";
import { Component } from "../basic/Component";

export interface MountablePage {
	component: Component,
	iconSrc: string,
}

export interface ScaffoldProps {
	account: string,
	pages: { [pageName: string]: MountablePage },
	onLogout: () => void,
}

/**
 * A component that renders workspace with an adjacent panel, where the
 * adjacent panel is a navigation bar.
 */
export const Scaffold = (parent: HTMLElement, { pages, ...args }: ScaffoldProps): HTMLElement => {
	const workspaceContainer = parent.appendChild(document.createElement("div"));
	workspaceContainer.style.display = "flex";
	workspaceContainer.style.flexFlow = "row nowrap";
	workspaceContainer.style.justifyContent = "space-between";
	workspaceContainer.style.alignItems = "flex-start";
	workspaceContainer.style.width = "100%";
	workspaceContainer.style.height = "100%";

	const mountedContainer = workspaceContainer.appendChild(document.createElement("div"));
	mountedContainer.style.height = "100%";
	mountedContainer.style.width = "100%";
	mountedContainer.style.position = "relative";
	mountedContainer.style.marginLeft = "4rem";

	const mountedPages: { [page: string]: Page } = Object.entries(pages).map(([name, { iconSrc, component }]): [string, Page] => {
		let mounted: HTMLElement | null = null;

		return [name, {
			cb: () => {
				if (mounted === null) {
					mounted = component(mountedContainer);
					mounted.style.transition = "opacity 0.3s";
					mounted.style.width = "100%";
					mounted.style.height = "100%";
					mounted.style.position = "absolute";
					mounted.style.top = "0";
					mounted.style.left = "0";

					return;
				}

				mounted.style.opacity = mounted.getAttribute("maxOpacity") || "100%";
				mounted.style.zIndex = "2";
			},
			onClose: () => {
				if (mounted) {
					if (mounted.style.opacity !== "0%") {
						mounted.setAttribute("maxOpacity", mounted.style.opacity);
					}

					mounted.style.opacity = "0%";
					mounted.style.zIndex = "1";
				}
			},
			iconSrc,
		}];
	}).reduce((dict, [name, constructed]) => { return { ...dict, [name]: constructed }; }, {});

	const nav = SideDrawer(workspaceContainer, { pages: mountedPages, ...args });
	nav.style.width = "15%";
	workspaceContainer.insertBefore(nav, mountedContainer);

	return workspaceContainer;
};
