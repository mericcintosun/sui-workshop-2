import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useState } from "react";
import { mintNft } from "./lib/contract";
import { useNetworkVariable } from "./networkConfig";
import { Box, Heading, Text, Button, Flex } from "@radix-ui/themes";

interface Nft {
  name: string;
  url: string;
}

function MintNft({
  refreshKey,
  setRefreshKey,
}: {
  refreshKey: number;
  setRefreshKey: (key: number) => void;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const packageId = useNetworkVariable("packageId");
  const mintAddresses = useNetworkVariable("mintAddresses");

  const suiClient = useSuiClient();
  const {
    mutate: signAndExecuteTransaction,
  } = useSignAndExecuteTransaction();

  const handleMintNft = (nft: Nft) => {
    setIsLoading(true);
    const tx = mintNft(nft, packageId, mintAddresses);
    signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          setName("");
          setUrl("");
          setPreviewUrl("");
          setRefreshKey(refreshKey + 1);
          setIsLoading(false);
          
          const { effects } = await suiClient.waitForTransaction({
            digest,
            options: {
              showEffects: true,
              showObjectChanges: true,
            },
          });
          
          const eventResult = await suiClient.queryEvents({
            query: {
              Transaction: digest,
            },
          });
          
          if (eventResult.data.length > 0) {
            console.log("event", eventResult.data);
            console.log("effects", effects);
          }
        },
        onError: (error: any) => {
          console.error("Transaction failed", error);
          setIsLoading(false);
        },
      },
    );
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setPreviewUrl(newUrl);
  };

  return (
    <Box style={{ width: '100%' }}>
      <Box mb="6" style={{ textAlign: 'center' }}>
        <Heading size="5" style={{ color: 'white', marginBottom: '8px', fontWeight: '600' }}>
          Create Your NFT
        </Heading>
        <Text size="2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Mint your unique digital asset on the Sui blockchain
        </Text>
      </Box>

      <Flex gap="6" style={{ 
        flexWrap: 'wrap', 
        width: '100%',
        alignItems: 'flex-start'
      }}>
        {/* Form Section */}
        <Box style={{ 
          flex: '1', 
          minWidth: '300px',
          width: '100%'
        }}>
          <Box style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '12px',
            padding: 'clamp(16px, 4vw, 24px)',
            border: '1px solid rgba(139, 69, 255, 0.1)',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleMintNft({ name, url });
              }}
              style={{ width: '100%' }}
            >
              <Box mb="4" style={{ width: '100%' }}>
                <Text size="2" style={{ 
                  color: 'white', 
                  marginBottom: '8px', 
                  display: 'block',
                  fontWeight: '500'
                }}>
                  NFT Name *
                </Text>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your NFT name..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(139, 69, 255, 0.2)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                />
              </Box>

              <Box mb="6" style={{ width: '100%' }}>
                <Text size="2" style={{ 
                  color: 'white', 
                  marginBottom: '8px', 
                  display: 'block',
                  fontWeight: '500'
                }}>
                  Image URL *
                </Text>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  required
                  placeholder="https://example.com/image.jpg"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(139, 69, 255, 0.2)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                />
              </Box>

              <Button
                type="submit"
                disabled={isLoading || !name || !url}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  background: isLoading 
                    ? 'rgba(139, 69, 255, 0.3)' 
                    : 'linear-gradient(45deg, #8b45ff, #6b46c1)',
                  border: 'none',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: (!name || !url) ? 0.5 : 1,
                  boxSizing: 'border-box'
                }}
              >
                {isLoading ? (
                  <Flex align="center" justify="center" gap="2">
                    <Box style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Minting...
                  </Flex>
                ) : (
                  'Mint NFT'
                )}
              </Button>
            </form>
          </Box>
        </Box>

        {/* Preview Section */}
        <Box style={{ 
          flex: '1', 
          minWidth: '300px',
          width: '100%'
        }}>
          <Box style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '12px',
            padding: 'clamp(16px, 4vw, 24px)',
            border: '1px solid rgba(139, 69, 255, 0.1)',
            height: 'fit-content',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <Text size="2" style={{ 
              color: 'white', 
              marginBottom: '16px', 
              display: 'block',
              fontWeight: '500'
            }}>
              Preview
            </Text>
            
            {previewUrl ? (
              <Box style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
                border: '1px solid rgba(139, 69, 255, 0.1)',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <img
                  src={previewUrl}
                  alt="NFT Preview"
                  style={{
                    width: '100%',
                    maxWidth: '200px',
                    height: 'auto',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    marginBottom: '12px'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <Text size="2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {name || 'Your NFT Name'}
                </Text>
              </Box>
            ) : (
              <Box style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '40px 20px',
                textAlign: 'center',
                border: '2px dashed rgba(139, 69, 255, 0.2)',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <Text size="2" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Enter an image URL to see preview
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default MintNft;
