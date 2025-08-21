import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

// Get environment variables with fallbacks
const getEnvVar = (key: string, fallback: string) => {
  return import.meta.env[key] || fallback;
};

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getEnvVar("VITE_SUI_RPC_URL", getFullnodeUrl("devnet")),
      variables: {
        packageId: getEnvVar(
          "VITE_PACKAGE_ID",
          "0x33a655a11b74a2d00b8cef851cd7772415fa9c64730bcda96e827b184bc621cc"
        ),
        mintAddresses: getEnvVar(
          "VITE_MINT_ADDRESSES",
          "0x30a2408094403c53815b07f053cb3fb836be5a80443326790f343e18d08294fa"
        ),
      },
    },
    testnet: {
      url: getEnvVar("VITE_SUI_RPC_URL", getFullnodeUrl("testnet")),
      variables: {
        packageId: getEnvVar(
          "VITE_PACKAGE_ID",
          "0x33a655a11b74a2d00b8cef851cd7772415fa9c64730bcda96e827b184bc621cc"
        ),
        mintAddresses: getEnvVar(
          "VITE_MINT_ADDRESSES",
          "0x30a2408094403c53815b07f053cb3fb836be5a80443326790f343e18d08294fa"
        ),
      },
    },
    mainnet: {
      url: getEnvVar("VITE_SUI_RPC_URL", getFullnodeUrl("mainnet")),
      variables: {
        packageId: getEnvVar(
          "VITE_PACKAGE_ID",
          "0x33a655a11b74a2d00b8cef851cd7772415fa9c64730bcda96e827b184bc621cc"
        ),
        mintAddresses: getEnvVar(
          "VITE_MINT_ADDRESSES",
          "0x30a2408094403c53815b07f053cb3fb836be5a80443326790f343e18d08294fa"
        ),
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
