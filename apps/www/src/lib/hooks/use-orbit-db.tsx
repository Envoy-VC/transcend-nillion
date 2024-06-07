/* eslint-disable @typescript-eslint/no-explicit-any -- no types */

/* eslint-disable @typescript-eslint/no-unsafe-member-access -- no types */

/* eslint-disable @typescript-eslint/no-unsafe-assignment -- no types */

/* eslint-disable @typescript-eslint/no-unsafe-call -- no types */
import { useEffect } from 'react';

// @ts-expect-error - no types
import { createOrbitDB } from '@orbitdb/core';
import { IDBBlockstore } from 'blockstore-idb';
import { createHelia } from 'helia';
import { create } from 'zustand';

import { useLibp2p } from './use-libp2p';

interface OrbitDBStore {
  orbitDB: any;
  setOrbitDB: (orbitDB: any) => void;
}

export const useOrbitDBStore = create<OrbitDBStore>((set) => ({
  orbitDB: null,
  setOrbitDB: (orbitDB: any) => set({ orbitDB }),
}));

export const useOrbitDB = () => {
  const { node } = useLibp2p();
  const { orbitDB, setOrbitDB } = useOrbitDBStore();

  useEffect(() => {
    const init = async () => {
      if (node && !orbitDB) {
        const blockstore = new IDBBlockstore('orbitdb');
        await blockstore.open();
        const ipfs = await createHelia({
          libp2p: node,
          blockstore,
        });
        const orbitdb = await createOrbitDB({ ipfs });
        setOrbitDB(orbitdb);
      }
    };

    void init();
  }, [orbitDB, node, setOrbitDB]);

  const createDatabase = async (peers: string[]) => {
    if (!orbitDB) {
      throw new Error('OrbitDB not initialized');
    }
    const meta = { peers };
    const db = await orbitDB.open('vault-db', { meta, type: 'documents' });
    return db.address as string;
  };

  return { orbitDB, createDatabase };
};
