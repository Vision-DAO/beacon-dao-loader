import { Component } from "../components/basic/Component";
import { IdeaMetaProvider } from "../utils/idea";
import { IPFSCache } from "../utils/ipfs";
import { TabbedNavBar } from "../components/layout/nav/TabbedNavBar";
import { Reactive, TextElemUpdater, NullTransformer } from "../components/basic/Reactive";
import { SideDrawer } from "../components/idea/SideDrawer";
import { NotFound } from "../components/basic/NotFound";
import { IdeaMetadata } from "beacon-dao";
import { marked } from "marked";
import dompurify from "dompurify";

/**
 * Creates a component that displays multiple tabs used for interacting with
 * the Beacon DAO:
 *
 * - About
 * - Proposals
 */
export const DaoHomePage = (contract: IdeaMetaProvider, metaCache: IPFSCache): Component => {
	return (parent: Node) => {
		const container = parent.appendChild(document.createElement("div"));
		container.style.zIndex = "2";

		const alt = NotFound(parent);
		alt.style.opacity = "0%";
		alt.style.zIndex = "1";
		alt.style.position = "absolute";
		alt.style.top = "0";
		alt.style.left = "0";

		// A helper method that hides the active view upon encountering a null value
		const viewTransformer = <T,>(v: T | null): T => NullTransformer(container, alt, v);

		// Live updating title of the DAO
		const title = Reactive<string, IdeaMetadata>(container.appendChild(document.createElement("h1")), {
			updater: TextElemUpdater,
			init: metaCache.getMeta<IdeaMetadata>(contract).then((meta) => viewTransformer(meta).title),
			stream: contract.stream(metaCache),
			transformer: (meta) => meta.title,
		});
		title.style.fontWeight = "normal";
		title.style.fontSize = "2.5em";
		title.style.margin = "0";
		title.style.marginBottom = "0.5em";

		// Subpages
		const about = AboutPage(contract, metaCache, viewTransformer)(container);

		container.insertBefore(TabbedNavBar(container, {
			"About": {
				cb: () => { about.style.opacity = "1"; },
				onClose: () => { about.style.opacity = "0"; },
				iconSrc: "",
			},
			"Proposals": {
				cb: () => { about.style.opacity = "1"; },
				onClose: () => { about.style.opacity = "0"; },
				iconSrc: "",
			}
		}), about);

		return container;
	};
};

/**
 * Items to display in the description of a DAO before it has loaded.
 */
const DescriptionLoader: Component = (parent: Node): HTMLElement => {
	const details = parent.appendChild(document.createElement("div"));

	Array(4).fill("&nbsp;").forEach((val, i) => {
		const fakeLine = details.appendChild(document.createElement("h1"));
		fakeLine.style.width = "100%";
		fakeLine.innerHTML = val;
		fakeLine.classList.add("shimmer-loading");

		if (i === 3)
			fakeLine.style.width = "80%";
	});

	return details;
};

export const AboutPage = (contract: IdeaMetaProvider, metaCache: IPFSCache, nullTransformer: <T,>(v: T | null) => T): Component => {
	return (parent: Node) => {
		// Displays the contents of the idea on one side, and a sidebar on the right
		const container = parent.appendChild(document.createElement("div"));
		container.style.fontSize = "0.9em";
		container.style.display = "flex";
		container.style.flexFlow = "row nowrap";
		container.style.justifyContent = "space-between";
		container.style.alignItems = "flex-start";
		container.style.paddingTop = "1em";

		const mainWorkArea = container.appendChild(document.createElement("div"));
		mainWorkArea.style.marginRight = "4em";
		mainWorkArea.style.flexGrow = "1";

		const descriptionLabel = mainWorkArea.appendChild(document.createElement("h1"));
		descriptionLabel.innerText = "Description";
		descriptionLabel.style.marginTop = "0";

		// A live updating description of the DAO, rendered in sanitized markdown
		const description = Reactive<string, IdeaMetadata>(mainWorkArea.appendChild(document.createElement("div")), {
			// Renders the description of the DAO as markdown
			updater: (markdown, node) => node.innerHTML = dompurify.sanitize(marked.parse(markdown)),
			init: metaCache.getMeta<IdeaMetadata>(contract).then((meta) => nullTransformer(meta).description),
			stream: contract.stream(metaCache),
			transformer: (meta) => meta.description,
			loadingContent: DescriptionLoader,
		});
		description.style.fontSize = "0.85em";
		description.classList.add("markdown");

		const drawer = SideDrawer(contract, metaCache)(container);
		drawer.style.maxWidth = "30%";

		return container;
	};
};
