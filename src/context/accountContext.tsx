"use client";
import { Account } from "@/app/lib/interfaces";
import { createContext, useContext, useState } from "react";

// Types
type AccountStateType = Account;
type AccountContextType = {
  data: AccountStateType;
  dispatch: React.Dispatch<React.SetStateAction<AccountStateType>>;
};

export const accountInitialState: AccountStateType = {
  id: "0x",
  isMinter: false,
  tokens: [],
};

export const AccountContext = createContext<AccountContextType>({
  data: accountInitialState,
  dispatch: () => {},
});

export const AccountProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, dispatch] = useState(accountInitialState);

  return (
    <AccountContext.Provider value={{ data, dispatch }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccountContext not found");
  }
  return context;
};
