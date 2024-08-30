"use client";
import { createContext, useContext, useState } from "react";

// Types

type ContractStateType = {
  seabrick: any;
  market: any;
};

type ContractContextType = {
  data: ContractStateType;
  dispatch: React.Dispatch<React.SetStateAction<ContractStateType>>;
};

const initialState: ContractStateType = {
  seabrick: {},
  market: {},
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
