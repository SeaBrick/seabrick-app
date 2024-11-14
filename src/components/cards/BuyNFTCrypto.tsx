import Image from "next/image";
import React, { useEffect, useState } from "react";
import SubmitButton from "../buttons/SubmitButton";
import { useContractContext } from "@/context/contractContext";
import AggregatorsLoader from "../loaders/AggregatorsLoader";
import { Aggregator, ERC20Token } from "@/lib/interfaces";
import ImageFallback from "../images/ImageFallback";
import { useAccount, useReadContract } from "wagmi";
import { aggregatorV3InterfaceAbi, ierc20Abi } from "@/lib/contracts/abis";
import { Address, formatUnits } from "viem";
import ConnectButton from "../buttons/ConnectButton";
import Link from "next/link";

interface SelecTokenButtonProps {
  setSelect: () => void;
  isSelected: boolean;
  token: ERC20Token;
  aggregator: Aggregator;
  walletAddress: Address;
}
const SelecTokenButton: React.FC<SelecTokenButtonProps> = ({
  token,
  setSelect,
  isSelected,
  walletAddress,
}) => {
  const { data: balance, refetch: refetchBalance } = useReadContract({
    abi: ierc20Abi,
    address: token.address,
    functionName: "balanceOf",
    args: [walletAddress],
  });

  return (
    <div className="grow shrink basis-0 justify-end items-end gap-4 flex">
      <div className="grow shrink basis-0 self-stretch flex-col justify-center items-start gap-2 inline-flex">
        <button
          onClick={setSelect}
          type="button"
          className={`self-stretch grow shrink basis-0 px-[15px] py-2.5 rounded-[5px] border border-[#babcc3]/60 justify-start items-center gap-2.5 inline-flex hover:bg-[#2069a0] hover:text-white ${isSelected && "bg-[#2069a0] text-white"}`}
        >
          <div className="w-[25px] h-[25px] relative">
            <div className="w-[22.22px] left-[1.40px] top-[1.39px] absolute">
              <ImageFallback
                width={25}
                height={25}
                className="w-[25px] h-[25px] object-cover"
                //  src="/tokens/ETH-R.webp"
                src={`/tokens/${token.symbol}.webp`}
                fallbackSrc="/tokens/empty-token.svg"
                alt="Token"
              />
            </div>
          </div>
          <div className="text-current text-sm font-normal font-['Noto Sans'] flex gap-x-2">
            {isSelected && (
              <span>
                {parseFloat(
                  formatUnits(
                    BigInt(balance?.toString() || "0"),
                    parseInt(token.decimals)
                  )
                ).toFixed(2)}
              </span>
            )}
            <span className={`${isSelected && "font-bold"}`}>
              {token.symbol}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

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

  const { isConnected, address: walletAddress } = useAccount();

  const { data: latestRoundData } = useReadContract({
    abi: aggregatorV3InterfaceAbi,
    address: aggregators[selectedToken]?.aggregator,
    functionName: "latestRoundData",
    args: [],
  });

  function onChangeQuantity(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    // Parse the input value as a number and handle NaN cases
    const parsedValue = Number(value);
    if (!isNaN(parsedValue)) {
      setQuantity(parsedValue);
    }
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
      <div className="w-full bg-white">
        <button
          className="bg-red-400 p-2 w-fit"
          onClick={() => {
            console.log("aggregators: ", aggregators);
            console.log("tokens: ", tokens);
            console.log("latestRoundData: ", latestRoundData);
            console.log("priceToken: ", pricePerToken);
          }}
        >
          Print data {pricePerToken}
        </button>
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
                            <SubmitButton
                              disable={!isConnected}
                              buttonClass="grow shrink basis-0 h-[45px] p-[17px] bg-[#2069a0] w-full rounded-[5px] justify-center items-center gap-2.5 flex"
                              label="Approve SOL Transaction"
                            />
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
