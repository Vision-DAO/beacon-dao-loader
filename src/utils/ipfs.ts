import { IPFSClient } from "ipfs-message-port-client";
import { CID } from "multiformats/cid";

/**
 * A smart contract that provides access to metadata at a CID.
 */
export interface MetaProvider {
	ipfsAddr(): Promise<string>;
	address: string;
	on(ln: () => void): void;
}

/**
 * A utility class that caches IPFS dag objects by their CID's.
 * Content at a CID never changes, so it can be cached COMPLETELY.
 */
export class IPFSCache {
	private items: { [cid: string]: unknown };
	public ipfs: IPFSClient;

	// Contracts that have cached metadata and can be dependencies for elements
	private blobs: { [addr: string]: string };
	private listeners: { [addr: string]: ((val: unknown) => void)[] };

	/**
	 * Creates an empty cache that will use the indicated client to query
	 * IPFS from now on.
	 *
	 * @param client - The IPFS instance to use for querying the network
	 */
	constructor(client: IPFSClient) {
		this.ipfs = client;
		this.items = {};
		this.blobs = {};
		this.listeners = {};

		let win: Window & typeof globalThis & { ipfs: unknown } =
			window as unknown as Window & typeof globalThis & { ipfs: unknown };
		win.ipfs = this.ipfs;
	}

	/**
	 * Gets a dag node from IPFS with the indicated CID, or null if it does not
	 * exist.
	 */
	async get<T>(cid: CID): Promise<T | null> {
		if (cid.toString() in this.items)
			return this.items[cid.toString()] as T;

		try {
			const res = await this.ipfs.dag.get(cid);

			if (res.value === null) return null;

			this.items[cid.toString()] = res.value;
			return res.value as T;
		} catch (e) {
			console.error(e);

			return null;
		}
	}

	/**
	 * Gets the binary data in the IPFS file stored at the given CID.
	 */
	async getFile(cid: string): Promise<Uint8Array | null> {
		if (cid.toString() in this.items)
			return this.items[cid.toString()] as Uint8Array;

		try {
			let buff = new Uint8Array();

			for await (const chunk of this.ipfs.cat(cid)) {
				const sink = new Uint8Array(buff.length + chunk.length);
				sink.set(buff);
				sink.set(chunk, buff.length);

				buff = sink;
			}

			this.items[cid.toString()] = buff;
			return buff;
		} catch (e) {
			console.error(e);

			return null;
		}
	}

	/**
	 * Gets the address of the metadata at the specified contract.
	 */
	async getMetaAddr(contract: MetaProvider): Promise<string> {
		// If the contract hasn't been seen before, perform its initial load
		if (!(contract.address in this.blobs)) {
			this.blobs[contract.address] = await contract.ipfsAddr();
		}

		return this.blobs[contract.address];
	}

	/**
	 * Gets the IPFS metadata from the contract by calling the `ipfsAddr` method.
	 * Returns an initialization (i.e., first load), unless a reload is
	 * triggered.
	 */
	async getMeta<T>(contract: MetaProvider): Promise<T | null> {
		const cid = CID.parse(await this.getMetaAddr(contract));

		if (cid === null) return null;

		return await this.get(cid);
	}

	/**
	 * Registers a listener for changes to the metadata stored at a contract.
	 */
	onMeta<T>(contract: MetaProvider, listener: (v: T) => void) {
		if (!(contract.address in this.listeners))
			this.listeners[contract.address] = [];

		this.listeners[contract.address].push(listener as (v: unknown) => void);

		// Register the callback nested within a listener that updates the IPFS
		// address of the contract's metadata whenever a state-changing event is
		// emitted
		contract.on(async () => {
			const newAddr = CID.parse(await contract.ipfsAddr());

			if (newAddr === null) return;

			const newMeta = await this.getMeta(contract);

			if (newMeta === null) return;

			this.listeners[contract.address].forEach((ln) => ln(newMeta));
		});
	}
}
