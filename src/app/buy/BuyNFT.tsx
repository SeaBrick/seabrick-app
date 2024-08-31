import { useEffect, useState } from "react";
import Container from "@/app/components/utils/Container";
import SelectTokens from "@/app/components/selects/SelectTokens";
import { Aggregator, Token } from "@/app/lib/interfaces";
import { wrapPromise } from "@/app/lib/utils";
import { getAggregatorsData } from "@/app/lib/subgraph";
import AggregatorsLoader from "../components/loaders/AggregatorsLoader";
import Modal from "../components/modals/Modal";
import GetFundsModal from "../components/modals/GetFundsModal";

export default function BuyNFT() {
  const [aggregators, setAggregators] = useState<Aggregator[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [index, setIndex] = useState<number>(0);

  const [open, setOpen] = useState<boolean>(false);

  return (
    <Container>
      <AggregatorsLoader
        dispatchAggregators={setAggregators}
        dispatchTokens={setTokens}
      />

      <GetFundsModal setOpen={setOpen} open={open} />

      <div className="px-8 pt-6 pb-8 flex flex-col gap-y-4">
        <div className="flex">
          <SelectTokens
            index={index}
            setIndex={setIndex}
            aggregators={aggregators}
            tokens={tokens}
          />

          <p
            onClick={() => setOpen(true)}
            className="self-center hover:text-seabrick-blue hover:cursor-pointer"
          >
            Get funds!
          </p>
        </div>
        <button
          className="bg-seabrick-blue p-2 w-fit rounded-xl text-white self-center"
          onClick={() => {
            console.log("index: ", index);
            console.log(aggregators[index]);
            console.log(tokens[index]);
          }}
        >
          Print
        </button>
      </div>
    </Container>
  );
}
