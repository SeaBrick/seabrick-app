"use client";
import React, { useEffect } from "react";
import { wrapPromise } from "@/lib/utils";
import { getSeabrickContract, getSeabrickMarket } from "@/lib/subgraph";
import { useContractContext } from "@/context/contractContext";

const getContracts = async () => {
  const seabrick = await getSeabrickContract();
  const market = await getSeabrickMarket();

  return { seabrick, market };
};

const getContractsData = wrapPromise(getContracts());

const ContractLoader: React.FC = () => {
  const { dispatch } = useContractContext();
  const contracts = getContractsData.read();

  useEffect(() => {
    dispatch((prevData) => ({
      ...prevData,
      seabrick: contracts.seabrick,
      market: contracts.market,
    }));
  }, [contracts, dispatch]);

  return <></>;
};

export default ContractLoader;
