import { contracts, schema } from "beacon-dao";
import { MetaProvider, IPFSCache } from "./ipfs";

/**
 * Ensures that the given object is a runnable WASM module.
 */
export const instanceOfPayload = (object: object): object is schema.Payload => "start" in object;

/**
 * Checks that an object provides a loader for a WASM module.
 */
export const instanceOfPayloadLoader = (object: object): object is schema.PayloadLoader => "default" in object;

/**
 * A convenience class that wraps an Idea contract, providing methods for
 * efficiently and easily loading metadata stored at the Idea.
 */
export class IdeaMetaProvider implements MetaProvider {
	private contract: contracts.Idea;
	public address: string;
	public metaEvents: string[];

	constructor(contract: contracts.Idea) {
		this.contract = contract;
		this.address = contract.address;
		this.metaEvents = ["ProposalAccepted"];
	}

	ipfsAddr(): Promise<string> {
		return this.contract.ipfsAddr();
	}

	on(ln: () => void) {
		this.metaEvents.forEach((e) => {
			this.contract.on(e, ln);
		});
	}

	/**
	 * Creates a stream suitable for use with the Reactive hook that consumes
	 * up-to-date metadata from the contract.
	 */
	stream(cache: IPFSCache): (listener: (e: schema.IdeaMetadata) => void) => void {
		return (ln) => cache.onMeta<schema.IdeaMetadata>(this, ln);
	}
}
