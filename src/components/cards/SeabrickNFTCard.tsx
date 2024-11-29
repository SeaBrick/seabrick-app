import Image from "next/image";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { useContractContext } from "@/context/contractContext";

interface CardProps {
  isOwner: boolean;
}

export default function SeabrickNFTCard(isOwner: CardProps) {
  const {
    data: { seabrick, market },
  } = useContractContext();

  return (
    <>
      <div className="p-5 bg-white rounded-[10px] justify-start items-start gap-6 inline-flex w-full h-full">
        <div className="grow shrink basis-0 justify-between items-start flex">
          <div className="w-full justify-start items-center gap-3 flex">
            <Image
              className="w-30"
              width={100}
              height={75}
              src={`/brick.webp`}
              alt="nft-image"
            ></Image>
            <div className="w-full flex-col justify-between items-start inline-flex">
              <div className=" flex-col justify-between items-center flex w-full pb-2">
                <div className=" flex-col justify-start items-stretch gap-6 flex w-full">
                  <div className=" justify-between items-start inline-flex">
                    <div className="flex-col justify-start items-start gap-3.5 inline-flex">
                      <div className=" justify-start items-end gap-2 inline-flex">
                        <div className="text-dark-gray text-4xl font-normal font-['Noto Sans']">
                          {seabrick.name}
                        </div>
                      </div>
                    </div>
                    <div className="w-[30px] h-[30px] relative">
                      <a
                        href="/buy"
                        className="w-[30px] h-[30px] left-0 top-0 absolute rounded-full border border-[#9b9a9b]/60 flex justify-center items-center hover:bg-slate-100 active:bg-slate-200"
                      >
                        <ArrowUpRightIcon className="size-[0.7rem]" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch flex-col justify-start items-start gap-1.5 flex">
                <div className="self-stretch justify-between items-center inline-flex">
                  <div className="text-black text-base font-normal font-['Noto Sans']">
                    Symbol
                  </div>
                  <div className="text-[#8a8a8f] text-base font-normal font-['Noto Sans']">
                    {seabrick.symbol}
                  </div>
                </div>
                <div className="self-stretch justify-between items-center inline-flex">
                  <div className="text-black text-base font-normal font-['Noto Sans']">
                    Address
                  </div>
                  <div className="text-[#8a8a8f] text-base font-normal font-['Noto Sans'] [overflow-wrap:anywhere] ml-3">
                    {seabrick.id}
                  </div>
                </div>
                <div className="self-stretch justify-between items-center inline-flex">
                  <div className="text-black text-base font-normal font-['Noto Sans']">
                    Total Supply
                  </div>
                  <div className="text-[#8a8a8f] text-base font-normal font-['Noto Sans']">
                    {seabrick.totalSupply}
                  </div>
                </div>
                <div className="self-stretch justify-between items-center inline-flex">
                  <div className="text-black text-base font-normal font-['Noto Sans']">
                    Price
                  </div>
                  <div className="text-[#8a8a8f] text-base font-normal font-['Noto Sans']">
                    {market.price} USD
                  </div>
                </div>
                {isOwner && (
                  <div className="self-stretch justify-between items-center inline-flex">
                    <div className="text-black text-base font-normal font-['Noto Sans']">
                      Vault Address
                    </div>
                    <div className="text-[#8a8a8f] text-base font-normal font-['Noto Sans']">
                      {market.claimVault}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
