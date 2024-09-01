import { Address, Hex } from "viem";

export interface Aggregator {
  id: string;
  name: Hex;
  nameReadable: string;
  aggregator: Address;
  decimals: string;
}

export interface Token {
  id: string;
  address: Address;
  decimals: string;
  name: string;
  symbol: string;
}
