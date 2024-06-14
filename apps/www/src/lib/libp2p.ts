import { type GossipsubEvents, gossipsub } from '@chainsafe/libp2p-gossipsub';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { bootstrap } from '@libp2p/bootstrap';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { type Identify, identify } from '@libp2p/identify';
import type { Libp2p, PeerId, PubSub } from '@libp2p/interface';
import { mplex } from '@libp2p/mplex';
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery';
import { webRTC, webRTCDirect } from '@libp2p/webrtc';
import { webSockets } from '@libp2p/websockets';
import * as filters from '@libp2p/websockets/filters';
import { createLibp2p } from 'libp2p';

export type NodeType = Libp2p<{
  pubsub: PubSub<GossipsubEvents>;
  identify: Identify;
}>;
export const createNode = async (peerId: PeerId): Promise<NodeType> => {
  const node = await createLibp2p({
    addresses: {
      listen: ['/webrtc'],
    },
    transports: [
      webSockets({
        filter: filters.all,
      }),
      webRTC({
        rtcConfiguration: {
          iceServers: [
            {
              urls: [
                'stun:stun.l.google.com:19302',
                'stun:global.stun.twilio.com:3478',
              ],
            },
          ],
        },
      }),
      webRTCDirect(),
      circuitRelayTransport({
        discoverRelays: 1,
      }),
    ],
    peerId,
    connectionEncryption: [noise()],
    streamMuxers: [yamux(), mplex()],
    peerDiscovery: [
      bootstrap({
        list: [import.meta.env.VITE_BOOTSTRAP_MULTIADDRS as string],
      }),
      pubsubPeerDiscovery({
        interval: 10,
      }),
    ],
    connectionGater: {
      denyDialMultiaddr: () => false,
    },
    services: {
      pubsub: gossipsub({
        allowPublishToZeroTopicPeers: true,
      }),
      identify: identify(),
    },
  });
  await node.start();
  return node;
};
