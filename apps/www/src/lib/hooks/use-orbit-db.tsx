/* eslint-disable @typescript-eslint/no-explicit-any -- no types */

/* eslint-disable @typescript-eslint/no-unsafe-member-access -- no types */

/* eslint-disable @typescript-eslint/no-unsafe-assignment -- no types */

/* eslint-disable @typescript-eslint/no-unsafe-call -- no types */
import { useEffect, useState } from 'react';

// @ts-expect-error - no types
import { createOrbitDB } from '@orbitdb/core';
import { IDBBlockstore } from 'blockstore-idb';
import { createHelia } from 'helia';
import { useLocalStorage } from 'usehooks-ts';
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
  const [db, setDB] = useState<any>(null);

  const [dbAddress, setDBAddress] = useLocalStorage<string | null>(
    'dbAddress',
    null
  );

  useEffect(() => {
    const init = async () => {
      if (node && !orbitDB) {
        const blockstore = new IDBBlockstore('orbitdb');
        await blockstore.open();
        const ipfs = await createHelia({
          libp2p: node,
          blockstore,
        });
        const orbitdb = await createOrbitDB({
          ipfs,
          id: node.peerId.toString(),
        });
        setOrbitDB(orbitdb);
        if (!dbAddress) return;
        const DB = await orbitdb.open(dbAddress);
        setDB(DB);
      }
    };

    void init();
  }, [orbitDB, node, setOrbitDB, dbAddress]);

  const createDatabase = async (peers: string[]) => {
    if (!orbitDB) {
      throw new Error('OrbitDB not initialized');
    }
    const meta = { peers };
    const db = await orbitDB.open('vault-db', { meta, type: 'documents' });
    setDBAddress(db.address);
    const DB = await orbitDB.open(dbAddress);
    setDB(DB);
    return db.address as string;
  };

  return { orbitDB, createDatabase, dbAddress, db };
};
