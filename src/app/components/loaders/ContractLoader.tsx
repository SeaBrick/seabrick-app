"use client";
import { useEffect } from "react";
import { wrapPromise } from "../utils";
import { getSeabrickContract, getSeabrickMarket } from "@/app/lib/subgraph";
import { addresses } from "@/app/lib/contracts";
import { useContractContext } from "@/context/contractContext";

const getContracts = async () => {
  const seabrick = await getSeabrickContract(addresses.SeabrickNFT);
  const market = await getSeabrickMarket(addresses.SeabrickMarket);

  return { seabrick, market };
};

const getContractsData = wrapPromise(getContracts());

const ContractLoader: React.FC = () => {
  const { dispatch } = useContractContext();
  const contracts = getContractsData.read();

  useEffect(() => {
    console.log("contr: ", contracts);
    dispatch((prevData) => ({
      ...prevData,
      seabrick: contracts.seabrick,
      market: contracts.market,
    }));
  }, []);

  return <></>;
};

export default ContractLoader;
