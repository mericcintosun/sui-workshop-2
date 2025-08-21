import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { Card, Text, Heading, Box, Button } from "@radix-ui/themes";
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
    const tx = updateNftMetadata(nftObjectId, editForm, packageId);
    
    signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          setEditingNft(null);
          setEditForm({ name: "", description: "", url: "" });
          
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
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const nftDataArray = data ? extractNFTData(data) : [];

  return (
    <Box p="4">
      {nftDataArray.length === 0 ? (
        <Text>No NFTs found</Text>
      ) : (
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            justifyContent: "center",
            alignItems: "start",
          }}
        >
          {nftDataArray.map((nftData, index) => (
            <Card
              key={index}
              size="3"
              style={{
                width: "100%",
                maxWidth: "none",
                minWidth: "auto",
              }}
            >
              <Box p="4">
                {editingNft === nftData.objectId ? (
                  // Edit Form
                  <Box>
                    <input
                      type="text"
                      placeholder="Name"
                      value={editForm.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, name: e.target.value })}
                      style={{ 
                        width: "100%", 
                        padding: "8px", 
                        marginBottom: "8px", 
                        borderRadius: "4px", 
                        border: "1px solid #ccc" 
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={editForm.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, description: e.target.value })}
                      style={{ 
                        width: "100%", 
                        padding: "8px", 
                        marginBottom: "8px", 
                        borderRadius: "4px", 
                        border: "1px solid #ccc" 
                      }}
                    />
                    <input
                      type="text"
                      placeholder="URL"
                      value={editForm.url}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, url: e.target.value })}
                      style={{ 
                        width: "100%", 
                        padding: "8px", 
                        marginBottom: "8px", 
                        borderRadius: "4px", 
                        border: "1px solid #ccc" 
                      }}
                    />
                    <Box style={{ display: "flex", gap: "8px" }}>
                      <Button 
                        size="1" 
                        onClick={() => handleUpdateNft(nftData.objectId)}
                      >
                        Save
                      </Button>
                      <Button 
                        size="1" 
                        variant="soft" 
                        onClick={() => setEditingNft(null)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  // Display Mode
                  <>
                    <Heading size="6" mb="3">
                      {nftData.name || "NFT"}
                    </Heading>
                    <Text as="p" size="3" color="gray" mb="3">
                      {nftData.description || "No description available"}
                    </Text>
                    {nftData.url && (
                      <img
                        src={nftData.url}
                        alt="NFT"
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <Button 
                      size="1" 
                      variant="soft" 
                      onClick={() => startEditing(nftData)}
                      style={{ marginTop: "8px" }}
                    >
                      Edit NFT
                    </Button>
                  </>
                )}
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default DisplayNft;
