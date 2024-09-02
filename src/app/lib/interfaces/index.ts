import { Address, Hex } from "viem";

export interface Aggregator {
  id: string;
  name: Hex;
  nameReadable: string;
  aggregator: Address;
  decimals: string;
}

export interface ERC20Token {
  id: string;
  address: Address;
  decimals: string;
  name: string;
  symbol: string;
}

export interface TokenNFT {
  id: Hex;
  tokenId: bigint;
  burned: bigint;
  owner: Account;
}

export interface Account {
  id: Hex;
  isMinter: boolean;
  tokens: TokenNFT[];
}

export interface Buy {
  tokenId: string;
  buyer: Address;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: Hex;
}

export interface Transfer {
  id: Hex;
  tokenId: string;
  from: Address;
  to: Address;
  transactionHash: Hex;
  blockTimestamp: string;
  blockNumber: string;
}
