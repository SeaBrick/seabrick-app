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
  ids: string[];
}
interface NotMintedResponse {
  isMinted: false;
}

export type MintSeabrickResp = MintedResponse | NotMintedResponse;

export interface CheckoutSessionResponse {
  id: string;
  session_id: string;
  user_id: string;
  fulfilled: boolean;
}
