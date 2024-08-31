export interface Aggregator {
  id: string;
  name: string;
  nameReadable: string;
  aggregator: string;
  decimals: string;
}

export interface Token {
  id: string;
  address: string;
  decimals: string;
  name: string;
  symbol: string;
}
