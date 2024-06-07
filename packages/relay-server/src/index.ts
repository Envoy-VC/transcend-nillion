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
import { createFromPrivKey } from '@libp2p/peer-id-factory';
import baseX from 'base-x';
import { keys } from '@libp2p/crypto';
import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig({
  path: '.env',
});

const createNode = async (
  peerId: PeerId,
  bootstraps: string[]
): Promise<Libp2p> => {
  const config: Libp2pOptions = {
    addresses: {
      listen: [`/ip4/127.0.0.1/tcp/${process.env.PORT}/ws`],
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

const base58 = baseX(
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
);

const key = base58.decode(process.env.USER_KEY ?? '');
const pubKey = key.subarray(32);

const privKey = new keys.Ed25519PrivateKey(key, pubKey);
const relayPeerID = await createFromPrivKey(privKey);

console.log(`
Relay Peer ID: ${relayPeerID.toString()}
`);

const relay = await createNode(relayPeerID, []);
console.log(`Relay started...\n`);

const relayMultiaddr = relay.getMultiaddrs().map((m) => m.toString());

console.log('Listening on: ', relayMultiaddr);

relay.addEventListener('peer:discovery', (e) => {
  const peer = e.detail;
  console.log(`Relay discovered: ${peer.id.toString()}`);
});

relay.addEventListener('peer:connect', (e) => {
  const peer = e.detail;
  console.log(`Relay connected to: ${peer.toString()}`);
});
