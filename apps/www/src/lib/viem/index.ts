import { type Config, createConfig, http } from 'wagmi';
import { anvil, mainnet, sepolia } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';

export const projectId = import.meta.env.WALLETCONNECT_ID as string;

const metadata = {
  name: 'Web3 Turbo Starter',
  description: 'Web3 starter kit with turborepo, wagmi, and Next.js',
  url: 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export const wagmiConfig: Config = createConfig({
  chains: [mainnet, sepolia, anvil],
  connectors: [walletConnect({ projectId, metadata, showQrModal: false })],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [anvil.id]: http(),
  },
});
