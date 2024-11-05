import { Hash } from "viem";

// Fulfillment
interface MintedFulFillResponse {
  isMinted: true;
}
interface NotMintedFulFillResponse {
  isMinted: false;
  message: string;
}
export type FulfillCheckoutResp =
  | MintedFulFillResponse
  | NotMintedFulFillResponse;

// Minter function
interface MintedResponse {
  isMinted: true;
  txHash: Hash;
}
interface NotMintedResponse {
  isMinted: false;
}

export type MintSeabrickResp = MintedResponse | NotMintedResponse;
