import { create } from "ipfs-core";

/**
 * An instance of an in-process IPFS node.
 */
export type IPFSClient = Awaited<ReturnType<typeof create>>;
