"use client";
import { Aggregator, ERC20Token } from "@/app/lib/interfaces";
import { getAggregatorsData, waitForSgIndexed } from "@/app/lib/subgraph";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Types
type AggregatorsStateType = {
  aggregators: Aggregator[];
  tokens: ERC20Token[];
};

type AggregatorsContextType = {
  data: AggregatorsStateType;
  dispatch: React.Dispatch<React.SetStateAction<AggregatorsStateType>>;
  refetch: (waitIndex?: bigint) => Promise<void>;
};

const initialState: AggregatorsStateType = {
  aggregators: [],
  tokens: [],
};

export const AggregatorsContext = createContext<AggregatorsContextType>({
  data: initialState,
  dispatch: () => {},
  refetch: async () => {},
});

export const AggregatorsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, dispatch] = useState(initialState);

  const refetch = useCallback(
    async (waitIndex?: bigint) => {
      if (waitIndex) {
        await waitForSgIndexed(waitIndex);
      }

      const data = await getAggregatorsData();
      const tokensArray = data.map((item) => item.token);
      const aggregatorsArray = data.map(({ token: _, ...rest }) => rest);

      dispatch(() => ({
        tokens: tokensArray,
        aggregators: aggregatorsArray,
      }));
    },
    [dispatch]
  );

  // Initial fetch
  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <AggregatorsContext.Provider value={{ data, dispatch, refetch }}>
      {children}
    </AggregatorsContext.Provider>
  );
};

export const useAggregatorsContext = () => {
  const context = useContext(AggregatorsContext);
  if (!context) {
    throw new Error("useAggregatorsContext not found");
  }
  return context;
};
