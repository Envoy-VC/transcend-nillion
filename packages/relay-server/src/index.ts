import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { circuitRelayServer } from '@libp2p/circuit-relay-v2';
import { identify } from '@libp2p/identify';
import { bootstrap } from '@libp2p/bootstrap';
import { mplex } from '@libp2p/mplex';
import { webSockets } from '@libp2p/websockets';
import * as filters from '@libp2p/websockets/filters';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { createLibp2p, Libp2pOptions } from 'libp2p';
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery';

const createNode = async (bootstraps: string[]) => {
  const config: Libp2pOptions = {
    addresses: {
      listen: ['/ip4/127.0.0.1/tcp/0/ws'],
    },
    transports: [
      webSockets({
        filter: filters.all,
      }),
    ],
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

const relay = await createNode([]);
console.log(`Relay started with id: ${relay.peerId.toString()}\n`);

const relayMultiaddr = relay.getMultiaddrs().map((m) => m.toString());

const [node1, node2] = await Promise.all([
  createNode(relayMultiaddr),
  createNode(relayMultiaddr),
]);

console.log(`
Node 1 started with id: ${node1.peerId.toString()}
Node 2 started with id: ${node2.peerId.toString()}
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
    node1.dial(multiAddr);
  }
});

node2.addEventListener('peer:discovery', (e) => {
  const peer = e.detail;
  console.log(`Node 2 discovered: ${nodes[peer.id.toString()]}`);
  const multiAddr = peer.multiaddrs;
  if (multiAddr.length > 0) {
    node2.dial(multiAddr);
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
