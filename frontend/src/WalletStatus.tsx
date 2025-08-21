import { useCurrentAccount } from "@mysten/dapp-kit";
import { Flex, Heading, Text, Box } from "@radix-ui/themes";
import DisplayNft from "./DisplayNft";
import MintNft from "./MintNft";
import { useState } from "react";

interface WalletStatusProps {
  activeTab: "mint" | "gallery";
}

export function WalletStatus({ activeTab }: WalletStatusProps) {
  const account = useCurrentAccount();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!account) {
    return (
      <Box style={{ textAlign: "center", padding: "60px 0" }}>
        <Box
          style={{
            width: "80px",
            height: "80px",
            background: "rgba(139, 69, 255, 0.1)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: "32px",
            border: "2px solid rgba(139, 69, 255, 0.2)",
          }}
        >
          🔗
        </Box>
        <Heading
          size="5"
          style={{ color: "white", marginBottom: "16px", fontWeight: "600" }}
        >
          Connect Your Wallet
        </Heading>
        <Text
          size="3"
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            maxWidth: "400px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          To start creating and managing your NFTs, please connect your Sui
          wallet using the button in the top right corner.
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* Wallet Info */}
      <Box
        mb="6"
        style={{
          background: "rgba(0, 0, 0, 0.4)",
          borderRadius: "12px",
          padding: "20px",
          border: "1px solid rgba(139, 69, 255, 0.1)",
        }}
      >
        <Flex align="center" gap="3" mb="3">
          <Box
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(45deg, #8b45ff, #6b46c1)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            ✓
          </Box>
          <Box>
            <Heading
              size="3"
              style={{ color: "white", margin: 0, fontWeight: "600" }}
            >
              Wallet Connected
            </Heading>
            <Text
              size="1"
              style={{ color: "rgba(255, 255, 255, 0.5)", margin: 0 }}
            >
              Ready to create and manage NFTs
            </Text>
          </Box>
        </Flex>
        <Text
          size="1"
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontFamily: "monospace",
            background: "rgba(0, 0, 0, 0.3)",
            padding: "8px 12px",
            borderRadius: "6px",
            wordBreak: "break-all",
            border: "1px solid rgba(139, 69, 255, 0.1)",
          }}
        >
          {account.address}
        </Text>
      </Box>

      {/* Content based on active tab */}
      {activeTab === "mint" ? (
        <MintNft refreshKey={refreshKey} setRefreshKey={setRefreshKey} />
      ) : (
        <DisplayNft refreshKey={refreshKey} />
      )}
    </Box>
  );
}
