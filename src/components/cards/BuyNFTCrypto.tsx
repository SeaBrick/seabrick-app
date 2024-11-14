import Image from "next/image";
import React, { useEffect, useState } from "react";
import SubmitButton from "../buttons/SubmitButton";
import { useContractContext } from "@/context/contractContext";
import AggregatorsLoader from "../loaders/AggregatorsLoader";
import { Aggregator, ERC20Token } from "@/lib/interfaces";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import {
  aggregatorV3InterfaceAbi,
  ierc20Abi,
  iMarketAbi,
} from "@/lib/contracts/abis";
import { formatUnits } from "viem";
import ConnectButton from "../buttons/ConnectButton";
import Link from "next/link";
import ApproveERC20Modal from "../modals/ApproveERC20Modal";
import { toast } from "react-toastify";
import SelecTokenButton from "../buttons/SelectTokenButton";

// TODO: Send transaction as async, wait for the tx hash. Then use the tx hash and get the logs
// to see if the tokens were buyed
// It's working, but need to be refined
// TODO: After a success buy, redirect to the return cart to show the buy info
const BuyNFTCrypto: React.FC = () => {
  const {
    data: {
      market: { price: marketPrice, id: marketAddress },
    },
  } = useContractContext();

  const [selectedToken, setSelectedToken] = useState<number>(0);
  // TODO : use a context for this aggregator and tokens
  const [aggregators, setAggregators] = useState<Aggregator[]>([]);
  const [tokens, setTokens] = useState<ERC20Token[]>([]);
  const [pricePerToken, setPricePerToken] = useState<bigint>(0n);
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<bigint>(0n);
  const [approveOpen, setApproveOpen] = useState<boolean>(false);
  const { isConnected, address: walletAddress } = useAccount();
  const [isBuying, setIsBuying] = useState<boolean>(false);

  const {
    data: hash,
    writeContract,
    isPending,
    writeContractAsync,
  } = useWriteContract();

  const { data: latestRoundData } = useReadContract({
    abi: aggregatorV3InterfaceAbi,
    address: aggregators[selectedToken]?.aggregator,
    functionName: "latestRoundData",
    args: [],
  });

  const { data: marketAllowance } = useReadContract({
    abi: ierc20Abi,
    address: tokens[selectedToken]?.address,
    functionName: "allowance",
    args: [walletAddress!, marketAddress],
  });

  function onChangeQuantity(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    // Parse the input value as a number and handle NaN cases
    const parsedValue = Number(value);
    if (!isNaN(parsedValue)) {
      setQuantity(parsedValue);
    }
  }

  async function buyAction() {
    if (!walletAddress) {
      toast.error("No wallet connected");
      return;
    }

    setIsBuying(true);
    await toast.promise(
      writeContractAsync({
        address: marketAddress,
        abi: iMarketAbi,
        functionName: "buy",
        args: [walletAddress, aggregators[selectedToken].name, quantity],
      }),
      {
        pending: "Buying the Seabrick",
        success: "Buy transaction complete",
        error: "Transaction failed",
      }
    );

    setIsBuying(false);
  }

  useEffect(() => {
    if (
      latestRoundData &&
      aggregators[selectedToken] &&
      tokens[selectedToken]
    ) {
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
      //

      const paymentAmount =
        (BigInt(marketPrice) *
          10n ** BigInt(tokens[selectedToken].decimals) *
          10n ** BigInt(aggregators[selectedToken].decimals)) /
        BigInt(latestRoundData[1]);

      setPricePerToken(paymentAmount);
    }
  }, [aggregators, latestRoundData, marketPrice, selectedToken, tokens]);

  useEffect(() => {
    setTotalPrice(BigInt(quantity) * pricePerToken);
  }, [pricePerToken, quantity]);

  return (
    <>
      {/* Aggregators data loader */}
      <AggregatorsLoader
        dispatchAggregators={setAggregators}
        dispatchTokens={setTokens}
      />

      {marketAllowance !== undefined && (
        <ApproveERC20Modal
          setOpen={setApproveOpen}
          open={approveOpen}
          token={tokens[selectedToken]}
          totalAmount={totalPrice}
          currentMarketAllowance={marketAllowance}
        />
      )}

      <div className="w-full bg-white">
        <div className="w-fit mx-auto">
          <div className="w-[580px] p-6 bg-white rounded-[10px] justify-start items-center gap-2.5 inline-flex">
            <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-[30px] inline-flex">
              <div className="self-stretch  flex-col justify-start items-start gap-6 flex">
                <div className="self-stretch justify-start items-center gap-4 inline-flex">
                  <Image
                    width={65}
                    height={62}
                    className="w-[65px]"
                    src="/brick.webp"
                    alt="token"
                  />
                  <div className="w-[332px] flex-col justify-between items-start inline-flex">
                    <div className="w-[254px] justify-start items-center gap-2.5 inline-flex">
                      <div className="text-[#8a8a8f] text-[15px] font-normal font-['Noto Sans']">
                        Seabrick NFT
                      </div>
                    </div>
                    <div className="self-stretch justify-start items-end gap-2.5 inline-flex">
                      <div className="w-full text-[#323232] text-4xl font-normal font-['Noto Sans']">
                        {marketPrice},00 US$
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 items-center">
                <ConnectButton />
                <div className="self-stretch flex-col justify-start items-start gap-5 flex">
                  {isConnected && walletAddress && (
                    <>
                      <div className="text-black text-sm font-normal font-['Noto Sans']">
                        Select Token
                      </div>
                      <div className="self-stretch justify-start items-start gap-4 grid grid-cols-2">
                        {tokens.map((token_, i) => {
                          return (
                            <SelecTokenButton
                              key={i}
                              walletAddress={walletAddress}
                              token={token_}
                              aggregator={aggregators[i]}
                              isSelected={selectedToken == i}
                              setSelect={() => setSelectedToken(i)}
                            />
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
                <div className="px-[17px] pt-[9px] bg-white rounded-xl border border-[#1a1a1a]/10 justify-center items-center pb-[12.8px] inline-flex">
                  <div className="grow shrink basis-0 pt-2.5 flex-col justify-start inline-flex">
                    <div className="self-stretch flex-col justify-start items-start gap-8 inline-flex">
                      <div className="flex flex-col gap-y-4 w-full">
                        <div className="self-stretch flex-col justify-start items-start gap-1.5 flex">
                          <div className="self-stretch text-[#1a1a1a]/70 text-[13px] font-semibold font-['Noto Sans'] leading-[16.90px]">
                            Quantity
                          </div>
                          <input
                            id="quantity"
                            type="number"
                            min={1}
                            value={quantity}
                            disabled={!isConnected}
                            onChange={onChangeQuantity}
                            placeholder=""
                            className="self-stretch px-[15px] py-2.5 bg-[#efeff4]/60 rounded-[5px] border border-[#babcc3]/60 text-[#8a8a8f] text-sm font-normal font-['Noto Sans']"
                          />
                        </div>

                        <div>
                          <p className="flex gap-x-1 font-['Noto Sans']">
                            <span className="font-bold">Amount required:</span>

                            <span>
                              {parseFloat(
                                formatUnits(
                                  totalPrice,
                                  parseInt(tokens[selectedToken]?.decimals)
                                )
                              ).toFixed(2)}
                            </span>
                            <span>{tokens[selectedToken]?.symbol}</span>
                          </p>
                        </div>
                      </div>
                      <div className="w-[498px] justify-center items-center inline-flex">
                        <div className="w-[498px] relative flex-col justify-start items-start flex gap-y-4">
                          <div className="pr-[50.59px] justify-start items-center inline-flex">
                            <div className="flex">
                              <input
                                id="check"
                                type="checkbox"
                                placeholder=""
                                className="mr-3"
                                required
                              />
                              <p className="text-[#1a1a1a]/70 text-[13px] font-normal font-['Noto Sans'] leading-[16.90px]">
                                I accept the Seabrick{" "}
                                <span className="underline text-blue-500 hover:text-blue-800">
                                  <Link
                                    href="https://kelpisland.notion.site/Terms-and-Conditions-44d6d6b976f84a86b21676438f784e61"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Terms of Service.
                                  </Link>
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="bg-[#2069a0] rounded-md shadow-inner w-fit mx-auto">
                            {totalPrice &&
                              marketAllowance !== undefined &&
                              (marketAllowance < totalPrice ? (
                                // Approve method
                                <SubmitButton
                                  onClick={() => {
                                    setApproveOpen(true);
                                  }}
                                  disable={!isConnected}
                                  buttonClass="grow shrink basis-0 h-[45px] p-[17px] bg-[#2069a0] w-full rounded-[5px] justify-center items-center gap-2.5 flex"
                                  label="Approve SOL Transaction"
                                />
                              ) : (
                                <SubmitButton
                                  onClick={() => {
                                    buyAction();
                                    console.log("Buy");
                                  }}
                                  disable={!isConnected || isBuying}
                                  buttonClass="grow shrink basis-0 h-[45px] p-[17px] bg-[#2069a0] w-full rounded-[5px] justify-center items-center gap-2.5 flex"
                                  label={isBuying ? "Buying" : "Buy Seabrick"}
                                />
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyNFTCrypto;
