import { gql, GraphQLClient } from "graphql-request";

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

export async function getDataContracts(): Promise<any> {
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
