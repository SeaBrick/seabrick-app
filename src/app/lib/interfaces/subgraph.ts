import { Address, Hash, Hex } from "viem";
import { Account, Aggregator, ERC20Token } from ".";

export interface AggregatorResponse extends Aggregator {
  token: ERC20Token;
}

export interface SingleBuyResponse {
  tokenId: string;
  transactionHash: Hash;
  buyer: Address;
  blockNumber: string;
  blockTimestamp: string;
}

export interface TokenResponse {
  id: Hex;
  tokenId: bigint;
  burned: boolean;
  owner: { id: Address };
}

export type AccountResponse = Account
