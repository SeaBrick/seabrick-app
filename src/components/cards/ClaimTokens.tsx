import { CurrencyDollarIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"
import ClaimModal from "../modals/ClaimModal"
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
    <ClaimModal open={open} setOpen={setOpen} title={"Tokens"}>
      <div className="gap-2 flex flex-col overflow-y-auto">
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
    </ClaimModal>
  )
}
