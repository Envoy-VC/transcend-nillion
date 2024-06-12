import py_nillion_client as nillion
from dotenv import dotenv_values, set_key
import asyncio

env = dotenv_values("../../apps/www/.env.local")


def create_nillion_client(userkey, nodekey):
    bootnodes = [env.get("VITE_NILLION_BOOTNODE_MULTIADDRESS")]
    payments_config = nillion.PaymentsConfig(
        env.get("VITE_NILLION_BLOCKCHAIN_RPC_ENDPOINT"),
        env.get("VITE_NILLION_WALLET_PRIVATE_KEY"),
        int(env.get("VITE_NILLION_CHAIN_ID")),
        env.get("VITE_NILLION_PAYMENTS_SC_ADDRESS"),
        env.get("VITE_NILLION_BLINDING_FACTORS_MANAGER_SC_ADDRESS"),
    )

    return nillion.NillionClient(
        nodekey,
        bootnodes,
        nillion.ConnectionMode.relay(),
        userkey,
        payments_config,
    )


def getUserKeyFromFile(userkey_filepath):
    return nillion.UserKey.from_file(userkey_filepath)


def getNodeKeyFromFile(nodekey_filepath):
    return nillion.NodeKey.from_file(nodekey_filepath)


async def main():
    cluster_id = env.get("VITE_NILLION_CLUSTER_ID")
    userkey = getUserKeyFromFile(
        env.get("VITE_NILLION_USERKEY_PATH_PARTY_1"))
    nodekey = getNodeKeyFromFile(
        env.get("VITE_NILLION_NODEKEY_PATH_PARTY_1"))
    client = create_nillion_client(userkey, nodekey)
    user_id = client.user_id
    program_name = "main"
    program_mir_path = f"./target/{program_name}.nada.bin"

    # store program
    action_id = await client.store_program(
        cluster_id, program_name, program_mir_path
    )

    program_id = f"{user_id}/{program_name}"
    print('Stored program. action_id:', action_id)
    print('Stored program_id:', program_id)

    set_key("../../apps/www/.env.local",
            "VITE_NILLION_PROGRAM_ID", program_id)


if __name__ == "__main__":
    asyncio.run(main())
