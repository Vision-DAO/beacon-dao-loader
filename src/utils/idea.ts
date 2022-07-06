import { Idea as IdeaContract, IdeaMetadata } from "beacon-dao";
import { PropStatus } from "./prop";
import { MetaProvider, IPFSCache } from "./ipfs";
import { toBytes, fromBytes } from "./common";
import { Libp2p } from "libp2p";
import { CID } from "multiformats/cid";

/**
 * A wrapper holding an Idea contract, statistics, and metadata about the
 * idea.
 */
export interface Idea {
	stats: IdeaStatisticsProvider,
	meta: IdeaMetaProvider,
	contract: IdeaContract,
}

/**
 * Information about an idea that is obtained through analyzing events with the
 * contract.
 */
export interface IdeaStatistics {
	totalVotes: number,
	author: string,
	proposalCounts: { [status: number]: number },
}

/**
 * A pubsub message disclosing new statistics about an Idea.
 */
type StatisticsMessage = NewIdeaMessage | NewProposalMessage | VoteCastMessage;

type NewIdeaMessage = {
	type: "NewIdea",
	author: string,
}

type NewProposalMessage  = {
	type: "NewProposal",
}

type VoteCastMessage = {
	type: "VoteCast",
	votes: number,
	nature: boolean,
}

/**
 * Fallback stats that represent defaults for a contract if it hasn't been
 * discovered yet.
 */
export const defaultStats: IdeaStatistics = {
	totalVotes: 0,
	author: "0x0000000000000000000000000000000000000000",
	proposalCounts: {
		[PropStatus.Successful]: 0,
		[PropStatus.Rejected]: 0,
		[PropStatus.Pending]: 0,
	},
};

/**
 * A convenience class that wraps an Idea contract, providing methods for
 * efficiently querying statistics about the Idea from libp2p.
 */
export class IdeaStatisticsProvider implements MetaProvider {
	private contract: IdeaContract;
	private libp2p: Libp2p;
	private ipfs: IPFSCache;

	/* The last known metadata state. */
	private state: {
		stats: IdeaStatistics,
		addr: CID,
	} | null = null;

	// The libp2p DHT uses byte array keys. This is the calculated value
	private key: Uint8Array;
	public address: string;

	// Statistics are gathered from contract events and gossiped messages
	public metaEvents: string[];
	public metaChannels: string[];

	constructor(contract: IdeaContract, libp2p: Libp2p, ipfs: IPFSCache) {
		this.contract = contract;
		this.address = contract.address;
		this.libp2p = libp2p;
		this.ipfs = ipfs;
		this.key = toBytes(this.address);
		this.metaEvents = ["ProposalAccepted", "ProposalRejected"];
		this.metaChannels = [this.address];
	}

	/**
	 * Gets the last-known snapshot of the statistics of the Idea.
	 * This should be the address of the local state, unless the stats provider
	 * wasn't initialized.
	 */
	async ipfsAddr(): Promise<string> {
		if (this.state !== null)
			return this.state.addr.toString();

		this.state = {
			stats: defaultStats,
			addr: await this.commit(defaultStats),
		};

		// A query to the DHT will not resolve immediately
		let addr;

		const resStream = this.libp2p.dht.get(this.key);

		for await (const val of resStream) {
			// The last one of these signals the best snapshot
			if (val.name === "VALUE") {
				addr = CID.decode(val.value);
			}
		}

		if (addr) {
			this.state = {
				stats: (await this.ipfs.ipfs.dag.get(addr)).value,
				addr,
			};
		}

		return this.state.addr.toString();
	}

	/**
	 * Publishes the current stat snapshot to IPFS, returning the CID of the
	 * uploaded state. Consumer must put to DHT manually.
	 */
	private async commit(stats: IdeaStatistics): Promise<CID> {
		return await this.ipfs.ipfs.dag.put(stats);
	}

	/**
	 * Waits for the next state-changing event from the contract, and passes the
	 * new state accordingly.
	 */
	on(ln: () => void) {
		// Contract events that affect overalls
		this.metaEvents.forEach((e) => {
			this.contract.on(e, () => {
				if (!this.state)
					return;

				switch (e) {
				case "ProposalAccepted":
					this.state.stats.proposalCounts[PropStatus.Successful]++;
					this.state.stats.proposalCounts[PropStatus.Pending]--;

					break;
				case "ProposalRejected":
					this.state.stats.proposalCounts[PropStatus.Rejected]++;
					this.state.stats.proposalCounts[PropStatus.Pending]--;

					break;
				}
			});
		});

		// Peer messages that affect more granular stats
		this.libp2p.pubsub.addEventListener("message", (m) => {
			if (m.detail.topic !== this.address)
				return;

			if (this.state === null)
				return;

			const data: StatisticsMessage = JSON.parse(fromBytes(m.detail.data));

			switch (data.type) {
			case "NewProposal":
				this.state.stats.proposalCounts[PropStatus.Pending]++;
				break;
			case "VoteCast":
				this.state.stats.totalVotes++;
				break;
			case "NewIdea":
				this.state.stats.author = data.author;
				break;
			}

			this.commit(this.state.stats);
			ln();
		});
		this.libp2p.pubsub.subscribe(this.address);
	}

	/**
	 * Creates a stream suitable for use with the Reactive hook that consumes
	 * up-to-date metadata from the contract.
	 */
	stream(cache: IPFSCache): (listener: (e: IdeaStatistics) => void) => void {
		return (ln) => cache.onMeta<IdeaStatistics>(this, ln);
	}
}

/**
 * A convenience class that wraps an Idea contract, providing methods for
 * efficiently and easily loading metadata stored at the Idea.
 */
export class IdeaMetaProvider implements MetaProvider {
	private contract: IdeaContract;
	public address: string;
	public metaEvents: string[];

	constructor(contract: IdeaContract) {
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
	stream(cache: IPFSCache): (listener: (e: IdeaMetadata) => void) => void {
		return (ln) => cache.onMeta<IdeaMetadata>(this, ln);
	}
}
