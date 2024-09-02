"use client";
import { gql, GraphQLClient } from "graphql-request";
import {
  AccountResponse,
  AggregatorResponse,
  SingleBuyResponse,
} from "../interfaces/subgraph";
import { Address, Hash } from "viem";

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
      aggregatorDatas(orderBy: nameReadable, orderDirection: desc) {
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

export async function getSingleBuy(
  txHash: Hash
): Promise<SingleBuyResponse | null> {
  console.log("txHash: ", txHash);
  const document = gql`
    {
      buys(where: {transactionHash: "${txHash}"}) {
        tokenId
        transactionHash
        buyer
        blockNumber
        blockTimestamp
      }
    }
  `;

  console.log("document: ");
  console.log(document);

  const buys = (await generateRequest(document)).buys;
  console.log("buys: ", buys);

  if (buys.length == 0) return null;

  return buys[0];
}

export async function getAccount(
  address: Address,
  first: number = 10
): Promise<AccountResponse> {
  const document = gql`
    {
      account(id: "${address}") {
        id
        isMinter
        tokens(first: ${first}, orderBy: id, orderDirection: desc) {
          id
          tokenId
        }
      }
    }
  `;

  return (await generateRequest(document)).account;
}
