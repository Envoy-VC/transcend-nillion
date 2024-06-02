import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { circuitRelayServer } from '@libp2p/circuit-relay-v2';
import { identify } from '@libp2p/identify';
import { bootstrap } from '@libp2p/bootstrap';
import { mplex } from '@libp2p/mplex';
import { webSockets } from '@libp2p/websockets';
import * as filters from '@libp2p/websockets/filters';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import type { Libp2pOptions } from 'libp2p';
import { createLibp2p } from 'libp2p';
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery';
import type { Libp2p, PeerId } from '@libp2p/interface';
import { createEd25519PeerId } from '@libp2p/peer-id-factory';

const createNode = async (
  peerId: PeerId,
  bootstraps: string[]
): Promise<Libp2p> => {
  const config: Libp2pOptions = {
    addresses: {
      listen: ['/ip4/127.0.0.1/tcp/0/ws'],
    },
    transports: [
      webSockets({
        filter: filters.all,
      }),
    ],
    peerId,
    connectionEncryption: [noise()],
    streamMuxers: [yamux(), mplex()],
    peerDiscovery: [
      pubsubPeerDiscovery({
        interval: 1000,
      }),
    ],
    services: {
      pubsub: gossipsub({
        allowPublishToZeroTopicPeers: true,
        fallbackToFloodsub: true,
      }),
      identify: identify(),
      relay: circuitRelayServer({
        reservations: {
          maxReservations: Infinity,
        },
      }),
    },
  } as const;

  if (bootstraps.length > 0) {
    config.peerDiscovery?.push(bootstrap({ list: bootstraps }));
  }

  const node = await createLibp2p(config);
  await node.start();
  return node;
};

const relayPeerID = await createEd25519PeerId();
const node1PeerID = await createEd25519PeerId();
const node2PeerID = await createEd25519PeerId();
relayPeerID.toCID();

console.log(`
Relay Peer ID: ${relayPeerID.toString()}
Node 1 Peer ID: ${node1PeerID.toString()}
Node 2 Peer ID: ${node2PeerID.toString()}
`);

const relay = await createNode(relayPeerID, []);
console.log(`Relay started...\n`);

const relayMultiaddr = relay.getMultiaddrs().map((m) => m.toString());

const [node1, node2] = await Promise.all([
  createNode(node1PeerID, relayMultiaddr),
  createNode(node2PeerID, relayMultiaddr),
]);

console.log(`
Node 1 started...}
Node 2 started...}
\n`);

const nodes = {
  [node1.peerId.toString()]: 'Node 1',
  [node2.peerId.toString()]: 'Node 2',
  [relay.peerId.toString()]: 'Relay',
};

node1.addEventListener('peer:discovery', (e) => {
  const peer = e.detail;
  console.log(`Node 1 discovered: ${nodes[peer.id.toString()]}`);
  const multiAddr = peer.multiaddrs;
  if (multiAddr.length > 0) {
    node1.dial(multiAddr).catch(console.log);
  }
});

node2.addEventListener('peer:discovery', (e) => {
  const peer = e.detail;
  console.log(`Node 2 discovered: ${nodes[peer.id.toString()]}`);
  const multiAddr = peer.multiaddrs;
  if (multiAddr.length > 0) {
    node2.dial(multiAddr).catch(console.log);
  }
});

node1.addEventListener('peer:connect', (e) => {
  const peer = e.detail;

  console.log(`Node 1 connected to: ${nodes[peer.toString()]}`);
});

node2.addEventListener('peer:connect', (e) => {
  const peer = e.detail;
  console.log(`Node 2 connected to: ${nodes[peer.toString()]}`);
});
