/* eslint-disable @typescript-eslint/no-explicit-any -- no types */

/* eslint-disable @typescript-eslint/no-unsafe-member-access -- no types */

/* eslint-disable @typescript-eslint/no-unsafe-assignment -- no types */

/* eslint-disable @typescript-eslint/no-unsafe-call -- no types */
import { useEffect, useState } from 'react';

import * as dagCbor from '@ipld/dag-cbor';
// @ts-expect-error - no types
import { createOrbitDB, parseAddress } from '@orbitdb/core';
import { IDBBlockstore } from 'blockstore-idb';
import { type HeliaLibp2p, createHelia } from 'helia';
import { base58btc } from 'multiformats/bases/base58';
import * as Block from 'multiformats/block';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import { useLocalStorage } from 'usehooks-ts';
import { create } from 'zustand';

import { type NodeType } from '../libp2p';
import { useLibp2p } from './use-libp2p';

interface OrbitDBStore {
  orbitDB: any;
  ipfs: HeliaLibp2p<NodeType> | null;
  setOrbitDB: (orbitDB: any) => void;
  setIPFS: (ipfs: HeliaLibp2p<NodeType>) => void;
}

export const useOrbitDBStore = create<OrbitDBStore>((set) => ({
  orbitDB: null,
  ipfs: null,
  setOrbitDB: (orbitDB: any) => set({ orbitDB }),
  setIPFS: (ipfs: HeliaLibp2p<NodeType>) => set({ ipfs }),
}));

export const useOrbitDB = () => {
  const { node } = useLibp2p();
  const { orbitDB, ipfs, setOrbitDB, setIPFS } = useOrbitDBStore();
  const [db, setDB] = useState<any>(null);

  const [dbAddress, setDBAddress] = useLocalStorage<string | null>(
    'dbAddress',
    null
  );

  useEffect(() => {
    const init = async () => {
      if (node && !orbitDB && !ipfs) {
        const blockstore = new IDBBlockstore('orbitdb');
        await blockstore.open();
        const ipfs = await createHelia({
          libp2p: node,
          blockstore,
        });
        setIPFS(ipfs);
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
  }, [orbitDB, node, setOrbitDB, dbAddress, setIPFS, ipfs]);

  const createDatabase = async (peers: string[]) => {
    if (!orbitDB) {
      throw new Error('OrbitDB not initialized');
    }
    const meta = { peers };
    const db = await orbitDB.open('vault-db', { meta, type: 'documents' });
    setDBAddress(db.address as string);
    const DB = await orbitDB.open(dbAddress);
    setDB(DB);
    return db.address as string;
  };

  const getDBDetails = async () => {
    if (!dbAddress) {
      throw new Error('DB Address not set');
    }
    if (!ipfs) {
      throw new Error('IPFS not initialized');
    }
    const addr = parseAddress(dbAddress);
    const cid = CID.parse(addr.hash as string, base58btc);
    const bytes = await ipfs.blockstore.get(cid);
    const { value } = await Block.decode({
      bytes,
      codec: dagCbor,
      hasher: sha256,
    });

    return value as {
      accessController: string;
      meta: { peers: string[] };
      name: string;
      type: string;
    };
  };

  return { orbitDB, createDatabase, dbAddress, db, setDBAddress, getDBDetails };
};
