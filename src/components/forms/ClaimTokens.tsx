import { CurrencyDollarIcon, XMarkIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"

interface TokensMap {
  id: number
  symbol: string
  logo: string
  amount: number
}
const testData: TokensMap[] = [
  {
    id: 1,
    symbol: "ETH",
    logo: "/tokens/eth.png",
    amount: 121,
  },
  {
    id: 2,
    symbol: "ETH",
    logo: "/tokens/sol.png",
    amount: 121,
  },
  {
    id: 3,
    symbol: "ETH",
    logo: "/tokens/usdc.png",
    amount: 121,
  },
  {
    id: 4,
    symbol: "ETH",
    logo: "/tokens/usdt.png",
    amount: 121,
  },
  {
    id: 5,
    symbol: "ETH",
    logo: "/brick.png",
    amount: 121,
  },
]
const mapTokenData: TokensMap[] = testData

function claimToken(token: TokensMap) {
  console.log("I Claimed ", token.symbol)
}
export default function ClaimTokens({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  open,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <>
      <div className="bg-white rounded-[10px] h-fit min-h-[300px] max-h-[70vh] w-[40vw] min-w-[450px] p-6 gap-6 flex flex-col">
        <div className="flex gap-2 justify-between">
          <div className="flex flex-col text-left gap-2">
            <span className="text-[#333333] text-3xl font-normal font-['Noto Sans']">
              Claim Tokens
            </span>
            <span className="text-[#8a8a8f] text-xs font-normal font-['Noto Sans']">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus
              quas natus ut praesentium, nulla sed error officiis quo.
            </span>
          </div>
          <div className="">
            <button
              className="w-[35px] h-[35px] rounded-full border border-[#9b9a9b]/60 flex justify-center items-center hover:bg-slate-50 active:bg-slate-200"
              onClick={() => setOpen(false)}
            >
              <XMarkIcon className="size-[1rem]" />
            </button>
          </div>
        </div>
        <div className="gap-2 flex flex-col overflow-y-auto">
          {/* mapping */}
          {mapTokenData.map((t, i) => {
            return (
              <div className="flex gap-3 justify-between" key={i}>
                <div className="px-3 py-1 grow shrink rounded-[5px] border border-[#babcc3]/60 justify-start items-center gap-2.5 inline-flex ">
                  <div className="rounded-[100px] bg-slate-200 h-[20px] w-[20px] flex justify-center items-center">
                    <Image
                      src={t.logo}
                      alt={t.symbol}
                      height={20}
                      width={20}
                      className="h-[20px] w-[20px] object-scale-down"
                    />
                  </div>
                  <div className="text-sm">{t.amount}</div>
                  <div className="text-sm font-bold">
                    {t.symbol.toUpperCase()}
                  </div>
                </div>
                <button
                  className="bg-[#2069a0] hover:bg-[#17548b] active:bg-[#4290d6] rounded-[5px] p-3 flex text-white items-center justify-between text-sm"
                  onClick={() => claimToken(t)}
                >
                  <CurrencyDollarIcon className="size-[1.25rem] inline mr-1" />{" "}
                  Claim
                </button>
              </div>
            )
          })}
        </div>
        <div className="flex justify-end">
          <button
            className="text-[#333333] text-sm font-normal font-['Noto Sans'] bg-[#efeff4] hover:bg-[#d9d9d9] active:bg-[#cccccc] rounded-[5px] p-3"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}
