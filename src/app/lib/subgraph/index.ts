"use client";
import { gql, GraphQLClient } from "graphql-request";
import {
  AccountResponse,
  AggregatorResponse,
  BuyResponse,
  MetaResponse,
  SingleBuyResponse,
  TransferResponse,
} from "../interfaces/subgraph";
import { Address, Hash, isHash } from "viem";
import { SeabrickMarket, SeabrickNFT } from "../interfaces";
import { sleep } from "../utils";

export const SubgraphClient = new GraphQLClient(
  "https://api.studio.thegraph.com/query/15039/seabrick/version/latest"
);

async function generateRequest<T>(queryDocument: string): Promise<T> {
  const client = SubgraphClient;
  return await client.request(queryDocument);
}

export async function checkSubgraph(blockNumber: bigint): Promise<boolean> {
  const document = gql`
    {
      _meta(block: { number_gte: ${blockNumber.toString()} }) {
        block {
          number
          timestamp
          hash
        }
      }
    }
  `;

  try {
    const metaResp = await generateRequest<{ _meta: MetaResponse }>(document);
    if (isHash(metaResp._meta.block.hash)) {
      return true;
    }

    throw new Error("Error to query the meta SG for index status");
  } catch (error) {
    if (
      error?.toString().includes("Failed to decode `block.number_gte` value")
    ) {
      return false;
    } else {
      console.log("error: ", error);
      throw new Error("Error when fetching the subgraph");
    }
  }
}

export async function getAccounts(): Promise<AccountResponse[]> {
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

  return (await generateRequest<{ accounts: AccountResponse[] }>(document))
    .accounts;
}

export async function getSeabrickContract(
  address: string
): Promise<SeabrickNFT> {
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

  return (await generateRequest<{ seabrickContract: SeabrickNFT }>(document))
    .seabrickContract;
}

export async function getSeabrickMarket(
  address: string
): Promise<SeabrickMarket> {
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

  return (
    await generateRequest<{ seabrickMarketContract: SeabrickMarket }>(document)
  ).seabrickMarketContract;
}

export async function getLatestBuys(
  first: number = 10
): Promise<BuyResponse[]> {
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

  return (await generateRequest<{ buys: BuyResponse[] }>(document)).buys;
}

export async function getLatestTransfers(
  first: number = 10
): Promise<TransferResponse[]> {
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

  return (await generateRequest<{ transfers: TransferResponse[] }>(document))
    .transfers;
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
          totalCollected
        }
      }
    }
  `;

  return (
    await generateRequest<{ aggregatorDatas: AggregatorResponse[] }>(document)
  ).aggregatorDatas;
}

export async function getSingleBuy(
  txHash: Hash
): Promise<SingleBuyResponse | null> {
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

  const buys = (await generateRequest<{ buys: SingleBuyResponse[] }>(document))
    .buys;

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
        tokens(
          first: ${first}, 
          orderBy: id, 
          orderDirection: desc, 
          where: {burned: false}
        ) {
          id
          tokenId
        }
      }
    }
  `;

  return (await generateRequest<{ account: AccountResponse }>(document))
    .account;
}

export async function waitForSgIndexed(
  blockNumber: bigint,
  callback?: () => void | Promise<void>
): Promise<void> {
  let counter = 0;

  while (counter < 2) {
    const result = await checkSubgraph(blockNumber);

    if (result) {
      if (callback) {
        await callback();
      }
      return;
    } else {
      counter++;
    }

    if (counter < 4) {
      await sleep(2000);
    }
  }
}
