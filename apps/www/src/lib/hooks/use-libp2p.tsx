'use client';

import { useEffect } from 'react';

import { keys } from '@libp2p/crypto';
import { createFromPrivKey } from '@libp2p/peer-id-factory';
import baseX from 'base-x';
import { create } from 'zustand';

import { type NodeType, createNode } from '../libp2p';
import { useNillion } from './use-nillion';

interface Libp2pStore {
  node: NodeType | null;
  setNode: (node: NodeType) => void;
}

export const useLibp2pStore = create<Libp2pStore>((set) => ({
  node: null,
  setNode: (node) => set({ node }),
}));

export const useLibp2p = () => {
  const { node, setNode } = useLibp2pStore();
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

        console.log({
          peerId,
        });
        const node = await createNode(peerId);
        console.log(node);
        setNode(node);
      }
    };
    void init();
  }, [node, setNode, userKey]);

  useEffect(() => {
    if (node) {
      node.addEventListener('peer:discovery', (e) => {
        const peer = e.detail;
        console.log('Discovered: ', peer);
      });
    }
  }, [node]);

  useEffect(() => {
    if (node) {
      node.addEventListener('peer:connect', (e) => {
        const peer = e.detail;
        console.log('Connected: ', peer);
      });
    }
  }, [node]);

  return { node };
};
