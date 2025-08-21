import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import { suiClient } from "../suiClient";
import { getSigner } from "./getSigner";
import { ENV } from "../env";
import { getAddress } from "./getAddress";

export const mintNft = async (): Promise<SuiTransactionBlockResponse> => {
  if (!ENV.USER_SECRET_KEY) {
    throw new Error("USER_SECRET_KEY is required");
  }

  const tx = new Transaction();

  tx.moveCall({
    target: `${ENV.PACKAGE_ID}::mintnft::mint`,
    arguments: [
      tx.object(ENV.MINTADDRESSES_ID),
      tx.pure(bcs.String.serialize("My NFT")),
      tx.pure(bcs.String.serialize("https://example.com/nft.jpg")),
    ],
  });

  return suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer: getSigner({ secretKey: ENV.USER_SECRET_KEY }),
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });
};
