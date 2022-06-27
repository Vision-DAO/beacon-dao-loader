import { create } from "ipfs-core";
import { IPFSService, Server } from "ipfs-message-port-server";
import type { MultiService } from "ipfs-message-port-protocol/src/rpc";

(async () => {
	const connections: MessagePort[] = [];
	self.onconnect = ({ ports }) => connections.push(...ports);

	const ipfs = await create();
	const service = new IPFSService(ipfs) as unknown as MultiService<IPFSService>;
	const server = new Server(service);

	self.onconnect = ({ ports }) => server.connect(ports[0]);

	for (const port of connections.splice(0)){
		server.connect(port);
	}
})();
