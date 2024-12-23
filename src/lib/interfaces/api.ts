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

interface TransferResponse {
  isTransfer: true;
  txHash: Hash;
}
interface NoTransferResponse {
  isTransfer: false;
}

export type TransferSeabrickResp = TransferResponse | NoTransferResponse;

export interface CheckoutSessionResponse {
  id: string;
  session_id: string;
  user_id: string;
  fulfilled: boolean;
}

export interface StripeBuysByUserResponse {
  id: string;
  claimed: boolean;
  token_id: string;
  created_at: string;
  updated_at: string;
}
