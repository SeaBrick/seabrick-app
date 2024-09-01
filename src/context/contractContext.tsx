"use client";
import { createContext, useContext, useState } from "react";
import { Address, zeroAddress } from "viem";

// Types
interface SeabrickNFT {
  id: Address;
  owner: Address;
  name: string;
  symbol: string;
  totalSupply: string;
}
interface SeabrickMarket {
  id: Address;
  owner: Address;
  price: string;
  token: Address;
}
type ContractStateType = {
  seabrick: SeabrickNFT;
  market: SeabrickMarket;
};

type ContractContextType = {
  data: ContractStateType;
  dispatch: React.Dispatch<React.SetStateAction<ContractStateType>>;
};

const initialState: ContractStateType = {
  seabrick: {
    id: zeroAddress,
    owner: zeroAddress,
    name: "",
    symbol: "",
    totalSupply: "",
  },
  market: {
    id: zeroAddress,
    owner: zeroAddress,
    price: "",
    token: zeroAddress,
  },
};

export const ContractContext = createContext<ContractContextType>({
  data: initialState,
  dispatch: () => {},
});

export const ContractProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, dispatch] = useState(initialState);

  return (
    <ContractContext.Provider value={{ data, dispatch }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContractContext = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContractContext not found");
  }
  return context;
};
