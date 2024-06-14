'use client';

import { useEffect } from 'react';

import { keys } from '@libp2p/crypto';
import type { PeerId, PeerInfo } from '@libp2p/interface';
import { createFromPrivKey } from '@libp2p/peer-id-factory';
import baseX from 'base-x';
import { create } from 'zustand';

import { type NodeType, createNode } from '../libp2p';
import { useNillion } from './use-nillion';

interface Libp2pStore {
  node: NodeType | null;
  discoveredPeers: PeerInfo[];
  connectedPeers: PeerId[];
  setNode: (node: NodeType) => void;
  setDiscoveredPeers: (peers: PeerInfo[]) => void;
  setConnectedPeers: (peers: PeerId[]) => void;
}

export const useLibp2pStore = create<Libp2pStore>((set) => ({
  node: null,
  discoveredPeers: [],
  connectedPeers: [],
  setNode: (node) => set({ node }),
  setDiscoveredPeers: (discoveredPeers) => set({ discoveredPeers }),
  setConnectedPeers: (connectedPeers) => set({ connectedPeers }),
}));

export const useLibp2p = () => {
  const {
    node,
    connectedPeers,
    discoveredPeers,
    setNode,
    setDiscoveredPeers,
    setConnectedPeers,
  } = useLibp2pStore();
  const { userKey } = useNillion();

  useEffect(() => {
    const init = async () => {
      if (userKey && !node) {
        const base58 = baseX(
          '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
        );
        const key = base58.decode(userKey);
        const pubKey = key.subarray(32);

        const privKey = new keys.Ed25519PrivateKey(key, pubKey);
        const peerId = await createFromPrivKey(privKey);

        const node = await createNode(peerId);
        setNode(node);
      }
    };
    void init();

    return () => {
      if (node) {
        void node.stop();
      }
    };
  }, [node, setNode, userKey]);

  useEffect(() => {
    const onNodeDiscovery = (e: CustomEvent<PeerInfo>) => {
      const peer = e.detail;
      const peers = Array.from(new Set([...discoveredPeers, peer]));
      setDiscoveredPeers(peers);
    };
    if (node) {
      node.addEventListener('peer:discovery', onNodeDiscovery);
    }

    return () => {
      if (node) {
        node.removeEventListener('peer:discovery', onNodeDiscovery);
      }
    };
  }, [discoveredPeers, node, setDiscoveredPeers]);

  useEffect(() => {
    const onNodeConnect = (e: CustomEvent<PeerId>) => {
      const peer = e.detail;
      const peers = Array.from(new Set([...connectedPeers, peer]));
      setConnectedPeers(peers);
    };
    if (node) {
      node.addEventListener('peer:connect', onNodeConnect);
    }

    return () => {
      if (node) {
        node.removeEventListener('peer:connect', onNodeConnect);
      }
    };
  }, [connectedPeers, node, setConnectedPeers]);

  useEffect(() => {
    const onPeerDisconnect = (e: CustomEvent<PeerId>) => {
      const peer = e.detail;
      const peers = connectedPeers.filter(
        (p) => p.toString() !== peer.toString()
      );
      setConnectedPeers(peers);
    };
    if (node) {
      node.addEventListener('peer:disconnect', onPeerDisconnect);
    }

    return () => {
      if (node) {
        node.removeEventListener('peer:disconnect', onPeerDisconnect);
      }
    };
  }, [connectedPeers, node, setConnectedPeers]);

  return { node, connectedPeers, discoveredPeers };
};
