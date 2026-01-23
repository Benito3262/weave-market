import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Weave Market',
  projectId: https://t.co/BtxoM8dUSk_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  chains: [baseSepolia],
  ssr: true,
});