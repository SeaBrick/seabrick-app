import { Address, Hash } from "viem";
import { Account, Aggregator, Buy, ERC20Token, Transfer } from ".";

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

export interface BlockResponse {
  number: number;
  timestamp: number;
  hash: Hash;
}

export interface MetaResponse {
  block: BlockResponse;
}

export type AccountResponse = Account;
export type BuyResponse = Buy;
export type TransferResponse = Transfer;
