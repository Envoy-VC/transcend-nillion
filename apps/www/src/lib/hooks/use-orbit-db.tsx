/* eslint-disable @typescript-eslint/no-explicit-any -- no types */

/* eslint-disable @typescript-eslint/no-unsafe-member-access -- no types */

/* eslint-disable @typescript-eslint/no-unsafe-assignment -- no types */

/* eslint-disable @typescript-eslint/no-unsafe-call -- no types */
import { useEffect } from 'react';

// @ts-expect-error - no types
import { createOrbitDB } from '@orbitdb/core';
import { createHelia } from 'helia';
import { create } from 'zustand';

import { useLibp2p } from './use-libp2p';

interface OrbitDBStore {
  db: any;
  setDB: (db: any) => void;
}

export const useOrbitDBStore = create<OrbitDBStore>((set) => ({
  db: null,
  setDB: (db) => set({ db }),
}));

export const useOrbitDB = () => {
  const { node } = useLibp2p();

  const { db, setDB } = useOrbitDBStore();

  useEffect(() => {
    const init = async () => {
      if (node && !db) {
        const ipfs = await createHelia({ libp2p: node });
        const orbitdb = await createOrbitDB({ ipfs });
        const db = await orbitdb.open('hello');
        setDB(db);
      }
    };

    void init();
  }, [db, node, setDB]);

  return { db };
};
