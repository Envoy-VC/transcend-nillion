/* eslint-disable @typescript-eslint/no-explicit-any -- no types */

/* eslint-disable @typescript-eslint/no-unsafe-member-access -- no types */

/* eslint-disable @typescript-eslint/no-unsafe-assignment -- no types */

/* eslint-disable @typescript-eslint/no-unsafe-call -- no types */
import { useEffect } from 'react';

import * as dagCbor from '@ipld/dag-cbor';
import { peerIdFromBytes } from '@libp2p/peer-id';
// @ts-expect-error - no types
// prettier-ignore
import { IPFSAccessController, Identities, createOrbitDB, parseAddress } from '@orbitdb/core';
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
  db: any;
  initialized: boolean;
  setOrbitDB: (orbitDB: any) => void;
  setIPFS: (ipfs: HeliaLibp2p<NodeType>) => void;
  setDB: (db: any) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useOrbitDBStore = create<OrbitDBStore>((set) => ({
  orbitDB: null,
  ipfs: null,
  db: null,
  initialized: false,
  setOrbitDB: (orbitDB: any) => set({ orbitDB }),
  setDB: (db: any) => set({ db }),
  setIPFS: (ipfs: HeliaLibp2p<NodeType>) => set({ ipfs }),
  setInitialized: (initialized: boolean) => set({ initialized }),
}));

export const useOrbitDB = () => {
  const { node } = useLibp2p();
  const {
    orbitDB,
    ipfs,
    initialized,
    db,
    setOrbitDB,
    setIPFS,
    setInitialized,
    setDB,
  } = useOrbitDBStore();

  const [dbAddress, setDBAddress] = useLocalStorage<string | null>(
    'dbAddress',
    null
  );

  useEffect(() => {
    const initialize = async () => {
      if (!node) return;
      if (initialized) return;
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
      if (dbAddress) {
        const DB = await orbitdb.open(dbAddress);
        setDB(DB);
      }

      setOrbitDB(orbitdb);
      setIPFS(ipfs);
      setInitialized(true);
    };

    void initialize();
  }, [
    node,
    dbAddress,
    initialized,
    setOrbitDB,
    setIPFS,
    setInitialized,
    setDB,
  ]);

  const createDatabase = async (peers: Uint8Array[]) => {
    const identityProvider = await Identities();
    const ids = [];
    for (const peer of peers) {
      const id = await identityProvider.createIdentity({
        id: peerIdFromBytes(peer).toString(),
      });
      console.log(id);
      ids.push(id.id);
    }
    const meta = { peers: peers.map((v) => Array.from(v)) };
    const db = await orbitDB.open('vault-db', {
      meta,
      type: 'documents',
      AccessController: IPFSAccessController({ write: ['*'] }),
    });
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
      meta: { peers: number[][] };
      name: string;
      type: string;
    };
  };

  const addEntry = async (path: string, names: string[], storeID: string) => {
    if (!db) {
      throw new Error('DB not initialized');
    }
    const data = {
      _id: path,
      names,
      storeID,
    };
    const hash = (await db.put(data)) as string;
    return hash;
  };

  const getAll = async () => {
    if (!db) {
      throw new Error('DB not initialized');
    }
    return (await db.all()) as {
      hash: string;
      key: string;
      value: {
        names: string[];
        storeID: string;
        _id: string;
      };
    }[];
  };

  const getOne = async (key: string) => {
    if (!db) {
      throw new Error('DB not initialized');
    }
    return (await db.get(key)) as {
      hash: string;
      key: string;
      value: {
        names: string[];
        storeID: string;
        _id: string;
      };
    };
  };

  return {
    orbitDB,
    createDatabase,
    dbAddress,
    db,
    setDBAddress,
    getDBDetails,
    addEntry,
    getAll,
    getOne,
  };
};
