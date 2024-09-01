import { Address, Hash } from "viem";
import { Aggregator, Token } from ".";

export interface AggregatorResponse extends Aggregator {
  token: Token;
}

export interface SingleBuyResponse {
  tokenId: string;
  transactionHash: Hash;
  buyer: Address;
  blockNumber: string;
  blockTimestamp: string;
}
