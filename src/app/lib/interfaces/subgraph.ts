import { Aggregator, Token } from ".";

export interface AggregatorResponse extends Aggregator {
  token: Token;
}
