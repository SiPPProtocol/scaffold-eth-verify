import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  braveWallet,
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains } from "wagmi";
import * as chains from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import scaffoldConfig from "~~/scaffold.config";
import { burnerWalletConfig } from "~~/services/web3/wagmi-burner/burnerWalletConfig";

// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
const enabledChains =
  scaffoldConfig.targetNetwork.id === 1
    ? [scaffoldConfig.targetNetwork]
    : [scaffoldConfig.targetNetwork, chains.mainnet];

/**
 * Chains for the app
 */
export const appChains = configureChains(
  enabledChains,
  [
    alchemyProvider({
      apiKey: scaffoldConfig.alchemyApiKey,
      priority: 0,
    }),
    publicProvider({ priority: 1 }),
  ],
  {
    stallTimeout: 3_000,
    // Sets pollingInterval if using chain's other than local hardhat chain
    ...(scaffoldConfig.targetNetwork.id !== chains.hardhat.id
      ? {
          pollingInterval: scaffoldConfig.pollingInterval,
        }
      : {}),
  },
);

/**
 * list of burner wallet compatable chains
 */
export const burnerChains = configureChains(
  [chains.hardhat],
  [
    alchemyProvider({
      apiKey: scaffoldConfig.alchemyApiKey,
    }),
    publicProvider(),
  ],
);

/**
 * wagmi connectors for the wagmi context
 */
export const wagmiConnectors = connectorsForWallets([
  {
    groupName: "Supported Wallets",
    wallets: [
      metaMaskWallet({ chains: appChains.chains, shimDisconnect: true }),
      walletConnectWallet({ chains: appChains.chains }),
      ledgerWallet({ chains: appChains.chains }),
      braveWallet({ chains: appChains.chains }),
      coinbaseWallet({ appName: "scaffold-eth", chains: appChains.chains }),
      rainbowWallet({ chains: appChains.chains }),
      burnerWalletConfig({ chains: burnerChains.chains }),
    ],
  },
]);
