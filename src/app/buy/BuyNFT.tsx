import { useEffect, useState } from "react";
import Container from "@/app/components/utils/Container";
import SelectTokens from "@/app/components/selects/SelectTokens";
import { Aggregator, Token } from "@/app/lib/interfaces";
import AggregatorsLoader from "../components/loaders/AggregatorsLoader";
import GetFundsModal from "../components/modals/GetFundsModal";
import { useAccount, useReadContract } from "wagmi";
import { Abi, formatUnits } from "viem";
import { aggregatorV3InterfaceAbi, ierc20Abi } from "../lib/contracts/abis";

export default function BuyNFT() {
  const [aggregators, setAggregators] = useState<Aggregator[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<Token>();
  const [selectedAggregator, setSelectedAggregator] = useState<Aggregator>();
  const { address: walletAddress } = useAccount();

  useEffect(() => {
    if (tokens.length > 0) {
      setSelectedToken(tokens[index]);
      setSelectedAggregator(aggregators[index]);
    }
  }, [tokens, index]);

  const { data: balance } = useReadContract({
    abi: ierc20Abi,
    address: selectedToken?.address,
    functionName: "balanceOf",
    args: [walletAddress!],
  });

  const { data: latestRoundData } = useReadContract({
    abi: aggregatorV3InterfaceAbi,
    address: selectedAggregator?.aggregator,
    functionName: "latestRoundData",
    args: [],
  });

  return (
    <>
      {/* Aggregators data loader */}
      <AggregatorsLoader
        dispatchAggregators={setAggregators}
        dispatchTokens={setTokens}
      />
      <Container>
        <div className="px-8 pt-6 pb-8 flex flex-col gap-y-4 divide-y-2">
          {selectedToken && selectedAggregator && (
            <>
              {/* Select funds */}
              <div className="flex flex-col gap-y-4">
                <div className="flex">
                  <SelectTokens
                    index={index}
                    setIndex={setIndex}
                    aggregators={aggregators}
                    tokens={tokens}
                  />

                  <GetFundsModal
                    setOpen={setOpen}
                    open={open}
                    token={selectedToken}
                  />

                  <p
                    onClick={() => setOpen(true)}
                    className="self-center hover:text-seabrick-blue hover:cursor-pointer underline"
                  >
                    Get funds!
                  </p>
                </div>

                <p>
                  Your {selectedToken.symbol} balance:{" "}
                  <span>
                    {formatUnits(
                      BigInt(balance?.toString() || "0"),
                      parseInt(selectedToken.decimals)
                    )}
                  </span>
                </p>
              </div>

              {/* Calculate price */}
              <div className="w-full pt-4">
                <p>Aprox NFT price: 100 {selectedToken.symbol}</p>
                <p>answer: {latestRoundData ? latestRoundData[1] : 0}</p>
              </div>
            </>
          )}
        </div>
      </Container>
    </>
  );
}
