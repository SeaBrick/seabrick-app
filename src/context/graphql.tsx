"use client";

import React, { createContext, useContext } from "react";
import { GraphQLClient } from "graphql-request";

const GraphQLClientContext = createContext(
  new GraphQLClient(
    "https://api.studio.thegraph.com/query/15039/seabrick/version/latest"
  )
);

export const useGraphQLClient = () => {
  return useContext(GraphQLClientContext);
};

export const GraphQLClientProvider = ({ children }: any) => {
  return (
    <GraphQLClientContext.Provider value={useGraphQLClient()}>
      {children}
    </GraphQLClientContext.Provider>
  );
};
