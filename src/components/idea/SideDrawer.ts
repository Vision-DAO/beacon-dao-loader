import { Component } from "../basic/Component";
import { Clickable } from "../basic/Clickable";
import { ReactiveComponent } from "../basic/Reactive";
import { KeyValueLabel } from "../basic/KeyValueLabel";
import { IPFSCache } from "../../utils/ipfs";
import { Idea, IdeaStatistics, defaultStats } from "../../utils/idea";
import { networkExplorer } from "../../utils/eth";
import { IPFS_GATEWAY } from "../../utils/conf";

const Label = (text: string, mapper?: (elem: HTMLElement) => void): Component =>
	(parent: Node): HTMLElement => {
		const label = parent.appendChild(document.createElement("p"));
		label.innerText = text;

		if (mapper)
			mapper(label);

		return label;
	};

const BoldLabel = (text: string, mapper?: (elem: HTMLElement) => void): Component =>
	Label(text, (label) => {
		label.style.fontFamily = "\"Roboto Mono\", \"Roboto\", Helvetica, sans-serif";
		label.style.fontWeight = "bold";

		if (mapper)
			mapper(label);
	});

const LinkLabel: Component = (parent: Node): HTMLElement => {
	const btnBox = parent.appendChild(document.createElement("div"));
	btnBox.style.display = "flex";
	btnBox.style.flexFlow = "row nowrap";
	btnBox.style.justifyContent = "flex-start";
	btnBox.style.alignItems = "center";

	Clickable(btnBox, () => {
		// Consumers can change this by setting this attribute
		const dest = btnBox.getAttribute("link_dest");

		if (dest !== null)
			window.open(dest, "_blank");
	}, true);

	const label = BoldLabel("")(btnBox);
	label.style.overflow = "hidden";
	label.style.textOverflow = "ellipsis";
	label.style.margin = "0";

	const icon = btnBox.appendChild(document.createElement("img"));
	icon.src = "assets/icons/open.svg";
	icon.style.height = "1.5em";
	icon.style.marginLeft = "0.5em";
	icon.style.opacity = "0.8";

	return btnBox;
};

/**
 * Renders meta-metadata about an Idea in a vertical list of key-val labels.
 *
 * TODO: Replace this with a module, instead.
 */
export const SideDrawer = (contract: Idea, metaCache: IPFSCache): Component =>
	(parent: Node): HTMLElement => {
		const container = parent.appendChild(document.createElement("div"));
		container.style.display = "flex";
		container.style.flexFlow = "column nowrap";
		container.style.justifyContent = "flex-start";
		container.style.alignItems = "stretch";

		// A label displaying the address of the author of the contract
		KeyValueLabel(Label("Created by"), ReactiveComponent<string, IdeaStatistics>(LinkLabel, {
			updater: (v, node) => {
				const label = node.querySelector("p");

				if (label)
					label.innerText = v;

				node.setAttribute("link_dest", `${networkExplorer(window.ethereum)}`);
			},
			init: metaCache.getMeta<IdeaStatistics>(contract.stats).then((meta) => (meta ?? defaultStats).author),
			stream: contract.stats.stream(metaCache),
			transformer: (meta) => meta.author,
		}));

		// A label that displays the IPFS CID of the content stored in the Idea
		KeyValueLabel(Label("Data ID"), ReactiveComponent<string, string>(LinkLabel, {
			updater: (v, node) => {
				const label = node.querySelector("p");

				if (label)
					label.innerText = v;

				node.setAttribute("link_dest", `${IPFS_GATEWAY}/ipfs/${v}`);
			},
			init: contract.meta.ipfsAddr(),
			stream: (ln) => contract.meta.on(async () => {
				ln(await metaCache.getMetaAddr(contract.meta));
			}),
			transformer: (v) => v,
			loadingContent: (parent: Node): HTMLElement => {
				const loadingLabel = parent.insertBefore(document.createElement("p"), parent.firstChild);
				loadingLabel.innerHTML = "&nbsp;";
				loadingLabel.classList.add("shimmer-loading");
				loadingLabel.style.width = "15em";
				loadingLabel.style.margin = "0";

				return loadingLabel;
			},
		}))(container);

		return container;
	};
