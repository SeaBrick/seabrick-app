import { useEffect, useState } from "react";
import { wrapPromise } from "../components/utils";
import { getAggregatorsData } from "../lib/subgraph";
import Container from "../components/utils/Container";

interface AggregatorsProps {
  dispatchAggregators: React.Dispatch<React.SetStateAction<any[]>>;
  dispatchTokens: React.Dispatch<React.SetStateAction<any[]>>;
}
const getAggregatorsInfo = async () => {
  return await getAggregatorsData();
};
const getData = wrapPromise(getAggregatorsInfo());

const Aggregators: React.FC<AggregatorsProps> = ({
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

function SelectTokens({ index, setIndex, aggregators, tokens }: any) {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setIndex(Number(value));
  };

  return (
    <>
      <form className="max-w-sm mx-auto">
        <label htmlFor="oracles" className="block mb-2 text-sm font-medium">
          Select an payment
        </label>

        <select
          onChange={(e) => handleSelectChange(e)}
          defaultValue={index}
          id="token-payment"
          className="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {tokens.map((token: any, i: number) => (
            <option key={token.id + "-" + i} value={i}>
              {token.name}
            </option>
          ))}
        </select>
      </form>
    </>
  );
}

export default function BuyNFT() {
  const [aggregators, setAggregators] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any[]>([]);
  const [index, setIndex] = useState<number>(0);

  return (
    <Container>
      <div className="px-8 pt-6 pb-8 flex flex-col gap-y-4">
        <Aggregators
          dispatchAggregators={setAggregators}
          dispatchTokens={setTokens}
        />
        <SelectTokens
          index={index}
          setIndex={setIndex}
          aggregators={aggregators}
          tokens={tokens}
        />
        Index: {index}
        <button
          onClick={() => {
            console.log(aggregators);
            console.log(tokens);
            console.log("index: ", index);
          }}
        >
          Print2
        </button>
      </div>
    </Container>
  );
}
