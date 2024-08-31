import { useEffect, useState } from "react";
import Container from "@/app/components/utils/Container";
import SelectTokens from "@/app/components/selects/SelectTokens";
import { Aggregator, Token } from "@/app/lib/interfaces";
import { wrapPromise } from "@/app/lib/utils";
import { getAggregatorsData } from "@/app/lib/subgraph";
import Aggregators from "../components/loaders/Aggregators";

export default function BuyNFT() {
  const [aggregators, setAggregators] = useState<Aggregator[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
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
