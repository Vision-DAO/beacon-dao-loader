import { Component } from "../components/basic/Component";
import { Idea } from "beacon-dao";
import { IPFSCache } from "../utils/ipfs";

/**
 * Creates a component that displays multiple tabs used for interacting with
 * the Beacon DAO:
 *
 * - About
 * - Proposals
 */
export const DaoHomePage = (metaCache: IPFSCache): Component => {
	return (parent: Node) => {
		const container = parent.appendChild(document.createElement("div"));
		return container;
	};
};
