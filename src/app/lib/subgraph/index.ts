"use client";
import { gql, GraphQLClient } from "graphql-request";
import { AggregatorResponse } from "../interfaces/subgraph";

export const SubgraphClient = new GraphQLClient(
  "https://api.studio.thegraph.com/query/15039/seabrick/version/latest"
);

async function generateRequest(queryDocument: string): Promise<any> {
  const client = SubgraphClient;
  return await client.request(queryDocument);
}

export async function getAccounts(): Promise<any> {
  const document = gql`
    {
      accounts {
        id
        isMinter
        tokens {
          id
          tokenId
        }
      }
    }
  `;

  return await generateRequest(document);
}

export async function getSeabrickContract(address: string): Promise<any> {
  const document = gql`
    {
      seabrickContract(id: "${address}") {
        id
        owner
        name
        symbol
        totalSupply
      }
    }
  `;

  return (await generateRequest(document)).seabrickContract;
}

export async function getSeabrickMarket(address: string): Promise<any> {
  const document = gql`
    {
      seabrickMarketContract(id: "${address}") {
        id
        owner
        price
        token
      }
    }
  `;

  return (await generateRequest(document)).seabrickMarketContract;
}

export async function getLatestBuys(first: number = 10): Promise<any[]> {
  const document = gql`
    {
      buys(orderBy: blockTimestamp, orderDirection: desc, first: ${first}) {
        buyer
        blockNumber
        blockTimestamp
        transactionHash
        tokenId
      }
    }
  `;

  return (await generateRequest(document)).buys;
}

export async function getLatestTransfers(first: number = 10): Promise<any[]> {
  const document = gql`
    {
      transfers(orderBy: blockTimestamp, orderDirection: desc, first: ${first}) {
        id
        tokenId
        from
        to
        transactionHash
        blockTimestamp
        blockNumber
      }
    }
  `;

  return (await generateRequest(document)).transfers;
}

export async function getAggregatorsData(): Promise<AggregatorResponse[]> {
  const document = gql`
    {
      aggregatorDatas {
        id
        name
        nameReadable
        aggregator
        decimals
        token {
          address
          decimals
          id
          name
          symbol
        }
      }
    }
  `;

  return (await generateRequest(document)).aggregatorDatas;
}
