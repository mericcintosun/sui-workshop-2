import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        packageId:
          "0x33a655a11b74a2d00b8cef851cd7772415fa9c64730bcda96e827b184bc621cc",
        mintAddresses:
          "0x30a2408094403c53815b07f053cb3fb836be5a80443326790f343e18d08294fa",
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        packageId:
          "0x33a655a11b74a2d00b8cef851cd7772415fa9c64730bcda96e827b184bc621cc",
        mintAddresses:
          "0x30a2408094403c53815b07f053cb3fb836be5a80443326790f343e18d08294fa",
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        packageId:
          "0x33a655a11b74a2d00b8cef851cd7772415fa9c64730bcda96e827b184bc621cc",
        mintAddresses:
          "0x30a2408094403c53815b07f053cb3fb836be5a80443326790f343e18d08294fa",
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
