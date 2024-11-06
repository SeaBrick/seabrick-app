import Image from "next/image"
import { ArrowUpRightIcon } from "@heroicons/react/24/outline"

export default function SeabrickNFTCard() {
  return (
    <>
      <div className="h-[215px] p-6 bg-white rounded-[10px] justify-start items-start gap-8 inline-flex">
        <div className="grow shrink basis-0 self-stretch justify-between items-start flex">
          <div className="w-[638px] self-stretch justify-start items-center gap-4 flex">
            <Image
              className="w-40 h-[154px]"
              width={160}
              height={140}
              src={`/brick.png`}
              alt="nft-image"
            ></Image>
            <div className="grow shrink basis-0 self-stretch flex-col justify-between items-start inline-flex">
              <div className="self-stretch h-[53px] flex-col justify-between items-center flex">
                <div className="self-stretch h-[35px] flex-col justify-start items-start gap-6 flex">
                  <div className="self-stretch justify-between items-start inline-flex">
                    <div className="w-[332px] flex-col justify-start items-start gap-4 inline-flex">
                      <div className="self-stretch justify-start items-end gap-2.5 inline-flex">
                        <div className="text-[#333333] text-4xl font-normal font-['Noto Sans']">
                          Seabrick NFT
                        </div>
                      </div>
                    </div>
                    <div className="w-[35px] h-[35px] relative">
                      <a
                        href="/" // TODO: Add url to nft on market
                        className="w-[35px] h-[35px] left-0 top-0 absolute rounded-full border border-[#9b9a9b]/60 flex justify-center items-center hover:bg-slate-50 active:bg-slate-200"
                      >
                        <ArrowUpRightIcon className="size-[0.7rem]" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch h-[94px] flex-col justify-start items-start gap-1.5 flex">
                <div className="self-stretch justify-between items-center inline-flex">
                  <div className="text-black text-sm font-normal font-['Noto Sans']">
                    Symbol
                  </div>
                  <div className="text-[#8a8a8f] text-sm font-normal font-['Noto Sans']">
                    SB_NFT
                  </div>
                </div>
                <div className="self-stretch justify-between items-center inline-flex">
                  <div className="text-black text-sm font-normal font-['Noto Sans']">
                    Address
                  </div>
                  <div className="text-[#8a8a8f] text-xs font-normal font-['Noto Sans']">
                    0x056b74b11c59b64cc532eed4bce181b3ad5412e0
                  </div>
                </div>
                <div className="self-stretch justify-between items-center inline-flex">
                  <div className="text-black text-sm font-normal font-['Noto Sans']">
                    Total Supply
                  </div>
                  <div className="text-[#8a8a8f] text-sm font-normal font-['Noto Sans']">
                    36
                  </div>
                </div>
                <div className="self-stretch justify-between items-center inline-flex">
                  <div className="text-black text-sm font-normal font-['Noto Sans']">
                    Price
                  </div>
                  <div className="text-[#8a8a8f] text-sm font-normal font-['Noto Sans']">
                    100 USD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
