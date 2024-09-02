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
