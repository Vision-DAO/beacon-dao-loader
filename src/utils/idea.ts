import { Idea, IdeaMetadata } from "beacon-dao";
import { MetaProvider, IPFSCache } from "./ipfs";

/**
 * A convenience class that wraps an Idea contract, providing methods for
 * efficiently and easily loading metadata stored at the Idea.
 */
export class IdeaMetaProvider implements MetaProvider {
	public contract: Idea;
	public address: string;
	public metaEvents: string[];

	constructor(contract: Idea) {
		this.contract = contract;
		this.address = contract.address;
		this.metaEvents = ["ProposalAccepted"];
	}

	ipfsAddr(): Promise<string> {
		return this.contract.ipfsAddr();
	}

	on(event: string, ln: () => void) {
		this.contract.on(event, ln);
	}

	removeAllListeners(): this {
		this.contract.removeAllListeners();

		return this;
	}

	/**
	 * Creates a stream suitable for use with the Reactive hook that consumes
	 * up-to-date metadata from the contract.
	 */
	stream(cache: IPFSCache): (listener: (e: IdeaMetadata) => void) => void {
		return (ln) => cache.onMeta<IdeaMetadata>(this, ln);
	}
}
