"use client";
import { useEffect, useState } from "react";
import Container from "@/components/utils/Container";
import SelectTokens from "@/components/selects/SelectTokens";
import { Aggregator, ERC20Token } from "@/lib/interfaces";
import AggregatorsLoader from "@/components/loaders/AggregatorsLoader";
import GetFundsModal from "@/components/modals/GetFundsModal";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { aggregatorV3InterfaceAbi, ierc20Abi } from "@/lib/contracts/abis";
import { useContractContext } from "@/context/contractContext";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import ApproveERC20Tokens from "@/components/contracts/ApproveERC20Tokens";
import Buy from "@/components/contracts/Buy";

export default function BuyNFT() {
  // TODO : use a context for this aggregator and tokens
  const [aggregators, setAggregators] = useState<Aggregator[]>([]);
  const [tokens, setTokens] = useState<ERC20Token[]>([]);
  const [selectedAggregator, setSelectedAggregator] = useState<Aggregator>();
  const [selectedToken, setSelectedToken] = useState<ERC20Token>();

  const {
    data: {
      market: { price: marketPrice, id: marketAddress },
    },
  } = useContractContext();
  const [index, setIndex] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [paymentPrice, setPaymentPrice] = useState<bigint>(0n);
  const [paymentPriceSlipPage, setPaymentPriceSlipPage] = useState<bigint>(0n);

  const [enoughApproved, setEnoughApproved] = useState<boolean>(false);

  const { address: walletAddress } = useAccount();

  useEffect(() => {
    if (tokens.length > 0) {
      setSelectedToken(tokens[index]);
      setSelectedAggregator(aggregators[index]);
    }
  }, [tokens, index, aggregators]);

  // Can use the status field to get the status of the call
  const { data: balance, refetch: refetchBalance } = useReadContract({
    abi: ierc20Abi,
    address: selectedToken?.address,
    functionName: "balanceOf",
    args: [walletAddress!],
  });
  const { data: marketAllowance, refetch: refetchMarketAllowance } =
    useReadContract({
      abi: ierc20Abi,
      address: selectedToken?.address,
      functionName: "allowance",
      args: [walletAddress!, marketAddress],
    });

  const { data: latestRoundData } = useReadContract({
    abi: aggregatorV3InterfaceAbi,
    address: selectedAggregator?.aggregator,
    functionName: "latestRoundData",
    args: [],
  });

  useEffect(() => {
    if (latestRoundData && selectedToken && selectedAggregator) {
      // - Calculations:
      //
      // Currency amount = marketUsdPrice  * (10^payment_decimals) * (10 ^ oracle_decimals)
      //                   ---------------------------------------------------------------
      //                                        latestRoundData
      //
      //
      // Market Currency Price = Token Currency unit (with decimals) * latestRoundData
      //                         ------------------------------------------------------
      //                             (10^payment_decimals) * (10 ^ oracle_decimals)

      const paymentAmount =
        (BigInt(marketPrice) *
          10n ** BigInt(selectedToken.decimals) *
          10n ** BigInt(selectedAggregator.decimals)) /
        BigInt(latestRoundData[1]);

      // TODO: Make configurable the slip page
      const slipPagePerc = 5n; // 5%
      const amountWithSlipPage =
        paymentAmount + (paymentAmount * slipPagePerc) / 100n;

      setPaymentPrice(paymentAmount);
      setPaymentPriceSlipPage(amountWithSlipPage);
    } else {
      setPaymentPrice(0n);
    }
  }, [
    latestRoundData,
    marketAllowance,
    marketPrice,
    selectedAggregator,
    selectedToken,
  ]);

  useEffect(() => {
    /* FIXME: Use other strategy for this kind of thing (marketAllowance can be undefined) and about the slip page*/
    if (
      marketAllowance != undefined &&
      marketAllowance < paymentPriceSlipPage
    ) {
      setEnoughApproved(false);
    } else {
      setEnoughApproved(true);
    }
  }, [paymentPrice, paymentPriceSlipPage, marketAllowance]);

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
              <div className="w-full pt-4 flex flex-col gap-y-4">
                <p className="font-bold">
                  NFT price (aprox):{" "}
                  <span className="font-normal">
                    {formatUnits(
                      paymentPrice,
                      parseInt(selectedToken.decimals)
                    )}{" "}
                    {selectedToken.symbol}
                  </span>
                </p>

                {/* FIXME: Use other strategy for this kind of thing (marketAllowance can be undefined) and about the slip page*/}
                {!enoughApproved && marketAllowance != undefined ? (
                  <div>
                    <ApproveERC20Tokens
                      token={selectedToken}
                      amount={paymentPriceSlipPage}
                      marketAllowance={marketAllowance}
                      refetch={refetchMarketAllowance}
                    />
                  </div>
                ) : (
                  <div className="flex flex-row gap-x-2">
                    <CheckCircleIcon className="size-6 text-green-600" />
                    <p>Enough approved tokens</p>
                  </div>
                )}
              </div>

              {/* Actual buy */}

              {enoughApproved && (
                <Buy aggregator={selectedAggregator} refetch={refetchBalance} />
              )}
            </>
          )}
        </div>
      </Container>
    </>
  );
}
