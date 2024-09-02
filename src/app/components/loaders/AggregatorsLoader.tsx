import { Aggregator, ERC20Token } from "@/app/lib/interfaces";
import { getAggregatorsData } from "@/app/lib/subgraph";
import { wrapPromise } from "@/app/lib/utils";
import { useEffect } from "react";

interface AggregatorsProps {
  dispatchAggregators: React.Dispatch<React.SetStateAction<Aggregator[]>>;
  dispatchTokens: React.Dispatch<React.SetStateAction<ERC20Token[]>>;
}
const getAggregatorsInfo = async () => {
  return await getAggregatorsData();
};
const getData = wrapPromise(getAggregatorsInfo());

const AggregatorsLoader: React.FC<AggregatorsProps> = ({
  dispatchAggregators,
  dispatchTokens,
}) => {
  const data = getData.read();

  useEffect(() => {
    const tokensArray = data.map((item) => item.token);
    const aggregatorsArray = data.map(({ token, ...rest }) => rest);
    dispatchTokens(tokensArray);
    dispatchAggregators(aggregatorsArray);
  }, []);

  return <></>;
};

export default AggregatorsLoader;
