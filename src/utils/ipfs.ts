import { IPFSClient } from "ipfs-message-port-client";
import { CID } from "multiformats/cid";

/**
 * A utility class that caches IPFS dag objects by their CID's.
 * Content at a CID never changes, so it can be cached COMPLETELY.
 */
export class IPFSCache {
	private items: { [cid: string]: unknown };
	private ipfs: IPFSClient;

	/**
	 * Creates an empty cache that will use the indicated client to query
	 * IPFS from now on.
	 *
	 * @param client - The IPFS instance to use for querying the network
	 */
	constructor(client: IPFSClient) {
		this.ipfs = client;
		this.items = {};
	}

	/**
	 * Gets a dag node from IPFS with the indicated CID, or null if it does not
	 * exist.
	 */
	async get<T>(cid: CID): Promise<T | null> {
		if (cid.toString() in this.items)
			return this.items[cid.toString()] as T;

		const res = await this.ipfs.dag.get(cid);

		if (res.value === null)
			return null;

		return res.value as T;
	}
}
