import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { Card, Text, Heading, Box, Button, Flex } from "@radix-ui/themes";
import { updateNftMetadata } from "./lib/contract";
//Type
import { PaginatedObjectsResponse, SuiObjectData } from "@mysten/sui/client";
import { useState } from "react";

interface NFTFields {
  name: string;
  description: string;
  url: string;
  objectId: string;
}

//Function to extract the image from the NFT
function extractNFTData(nfts: PaginatedObjectsResponse): NFTFields[] {
  const nftArray: NFTFields[] = [];

  for (const object of nfts.data) {
    const content = object.data?.content as SuiObjectData["content"];
    if (content && "dataType" in content && content.dataType === "moveObject") {
      const nftData = (content as any).fields as NFTFields;
      nftArray.push({
        ...nftData,
        objectId: object.data?.objectId || "",
      });
    }
  }

  return nftArray;
}

function DisplayNft({ refreshKey }: { refreshKey: number }) {
  const account = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");
  const suiClient = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  
  const [editingNft, setEditingNft] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    url: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address as string,
      options: {
        showContent: true,
      },
      filter: {
        StructType: `${packageId}::mintnft::Nft`
      },
    },
    {
      enabled: !!account,
      refetchInterval: refreshKey,
    },
  );

  const handleUpdateNft = (nftObjectId: string) => {
    setIsUpdating(true);
    const tx = updateNftMetadata(nftObjectId, editForm, packageId);
    
    signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          setEditingNft(null);
          setEditForm({ name: "", description: "", url: "" });
          setIsUpdating(false);
          
          const { effects } = await suiClient.waitForTransaction({
            digest,
            options: {
              showEffects: true,
              showObjectChanges: true,
            },
          });
          
          console.log("NFT updated successfully!", effects);
        },
        onError: (error: any) => {
          console.error("Update failed", error);
          setIsUpdating(false);
        },
      },
    );
  };

  const startEditing = (nft: NFTFields) => {
    setEditingNft(nft.objectId);
    setEditForm({
      name: nft.name,
      description: nft.description,
      url: nft.url,
    });
  };

  if (isPending) {
    return (
      <Box style={{ textAlign: 'center', padding: '60px 0', width: '100%' }}>
        <Box style={{
          width: '40px',
          height: '40px',
          border: '2px solid rgba(139, 69, 255, 0.3)',
          borderTop: '2px solid #8b45ff',
          borderRadius: '50%',
          margin: '0 auto 16px',
          animation: 'spin 1s linear infinite'
        }} />
        <Text size="2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Loading your NFT collection...
        </Text>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box style={{ textAlign: 'center', padding: '60px 0', width: '100%' }}>
        <Box style={{
          width: '40px',
          height: '40px',
          background: 'rgba(255, 0, 0, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: '20px',
          border: '1px solid rgba(255, 0, 0, 0.2)'
        }}>
          ❌
        </Box>
        <Text size="2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Error: {error.message}
        </Text>
      </Box>
    );
  }

  const nftDataArray = data ? extractNFTData(data) : [];

  return (
    <Box style={{ width: '100%' }}>
      <Box style={{ marginBottom: '32px', textAlign: 'center' }}>
        <Heading size="5" style={{ color: 'white', marginBottom: '8px', fontWeight: '600' }}>
          My NFT Gallery
        </Heading>
        <Text size="2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          {nftDataArray.length === 0 
            ? "Start creating your digital art collection" 
            : `You own ${nftDataArray.length} unique NFT${nftDataArray.length > 1 ? 's' : ''}`
          }
        </Text>
      </Box>

      {nftDataArray.length === 0 ? (
        <Box style={{ textAlign: 'center', padding: '60px 0', width: '100%' }}>
          <Box style={{
            width: '80px',
            height: '80px',
            background: 'rgba(139, 69, 255, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '32px',
            border: '2px solid rgba(139, 69, 255, 0.2)'
          }}>
            🎨
          </Box>
          <Heading size="4" style={{ color: 'white', marginBottom: '16px', fontWeight: '600' }}>
            No NFTs Yet
          </Heading>
          <Text size="2" style={{ 
            color: 'rgba(255, 255, 255, 0.6)', 
            maxWidth: '400px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Create your first NFT to start building your digital art collection. 
            Switch to the "Create" tab to get started!
          </Text>
        </Box>
      ) : (
        <Box style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'clamp(16px, 3vw, 20px)',
          justifyContent: 'center',
          alignItems: 'start',
          width: '100%'
        }}>
          {nftDataArray.map((nftData, index) => (
            <Card
              key={index}
              size="3"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(139, 69, 255, 0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {editingNft === nftData.objectId ? (
                // Edit Form
                <Box p="4" style={{ width: '100%', boxSizing: 'border-box' }}>
                  <Text size="2" style={{ 
                    color: 'white', 
                    marginBottom: '16px', 
                    display: 'block',
                    fontWeight: '500'
                  }}>
                    Edit NFT
                  </Text>
                  
                  <Box mb="3" style={{ width: '100%' }}>
                    <Text size="1" style={{ 
                      color: 'rgba(255, 255, 255, 0.6)', 
                      marginBottom: '6px', 
                      display: 'block'
                    }}>
                      Name
                    </Text>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(139, 69, 255, 0.2)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </Box>
                  
                  <Box mb="3" style={{ width: '100%' }}>
                    <Text size="1" style={{ 
                      color: 'rgba(255, 255, 255, 0.6)', 
                      marginBottom: '6px', 
                      display: 'block'
                    }}>
                      Description
                    </Text>
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, description: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(139, 69, 255, 0.2)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </Box>
                  
                  <Box mb="4" style={{ width: '100%' }}>
                    <Text size="1" style={{ 
                      color: 'rgba(255, 255, 255, 0.6)', 
                      marginBottom: '6px', 
                      display: 'block'
                    }}>
                      Image URL
                    </Text>
                    <input
                      type="url"
                      value={editForm.url}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, url: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(139, 69, 255, 0.2)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </Box>
                  
                  <Flex gap="2" style={{ width: '100%' }}>
                    <Button 
                      size="2" 
                      onClick={() => handleUpdateNft(nftData.objectId)}
                      disabled={isUpdating}
                      style={{
                        flex: '1',
                        background: isUpdating 
                          ? 'rgba(139, 69, 255, 0.3)' 
                          : 'linear-gradient(45deg, #8b45ff, #6b46c1)',
                        border: 'none',
                        color: 'white',
                        fontWeight: '500',
                        minWidth: '0'
                      }}
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                      size="2" 
                      variant="soft" 
                      onClick={() => setEditingNft(null)}
                      disabled={isUpdating}
                      style={{
                        flex: '1',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(139, 69, 255, 0.2)',
                        color: 'white',
                        minWidth: '0'
                      }}
                    >
                      Cancel
                    </Button>
                  </Flex>
                </Box>
              ) : (
                // Display Mode
                <>
                  <Box style={{
                    position: 'relative',
                    height: '180px',
                    background: 'linear-gradient(45deg, #1a1a2e, #16213e)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                  }}>
                    {nftData.url ? (
                      <img
                        src={nftData.url}
                        alt={nftData.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Text size="3" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                        No Image
                      </Text>
                    )}
                    
                    <Button 
                      size="1" 
                      variant="soft" 
                      onClick={() => startEditing(nftData)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        border: '1px solid rgba(139, 69, 255, 0.3)',
                        color: 'white',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}
                    >
                      Edit
                    </Button>
                  </Box>
                  
                  <Box p="4" style={{ width: '100%', boxSizing: 'border-box' }}>
                    <Heading size="3" style={{ 
                      color: 'white', 
                      marginBottom: '8px',
                      fontWeight: '600'
                    }}>
                      {nftData.name || "Untitled NFT"}
                    </Heading>
                    <Text size="1" style={{ 
                      color: 'rgba(255, 255, 255, 0.6)', 
                      marginBottom: '12px',
                      lineHeight: '1.4'
                    }}>
                      {nftData.description || "No description available"}
                    </Text>
                    
                    <Box style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      border: '1px solid rgba(139, 69, 255, 0.1)',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}>
                      <Text size="1" style={{ 
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all'
                      }}>
                        ID: {nftData.objectId.slice(0, 8)}...{nftData.objectId.slice(-8)}
                      </Text>
                    </Box>
                  </Box>
                </>
              )}
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default DisplayNft;
