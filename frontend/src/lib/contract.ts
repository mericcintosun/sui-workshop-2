import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

interface Nft {
  name: string;
  url: string;
}

interface UpdateNftData {
  name: string;
  description: string;
  url: string;
}

export const mintNft = (nft: Nft, packageId: string, mintAddresses: string) => {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::mintnft::mint`,
    arguments: [
      tx.object(mintAddresses),
      tx.pure(bcs.String.serialize(nft.name)),
      tx.pure(bcs.String.serialize(nft.url)),
    ],
  });
  return tx;
};

export const updateNftMetadata = (
  nftObjectId: string,
  updateData: UpdateNftData,
  packageId: string
) => {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::mintnft::update_nft_metadata`,
    arguments: [
      tx.object(nftObjectId),
      tx.pure(bcs.String.serialize(updateData.name)),
      tx.pure(bcs.String.serialize(updateData.description)),
      tx.pure(bcs.String.serialize(updateData.url)),
    ],
  });
  return tx;
};
