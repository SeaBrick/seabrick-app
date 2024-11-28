import { CurrencyDollarIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import { Dispatch, SetStateAction, useState } from "react"
import ClaimModal from "../modals/ClaimModal"
import { ModalDone } from "../modals/ModalDone"
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
    logo: "/tokens/eth.webp",
    amount: 121,
  },
  {
    id: 2,
    symbol: "ETH",
    logo: "/tokens/sol.webp",
    amount: 121,
  },
  {
    id: 3,
    symbol: "ETH",
    logo: "/tokens/usdc.webp",
    amount: 121,
  },
  {
    id: 4,
    symbol: "ETH",
    logo: "/tokens/usdt.webp",
    amount: 121,
  },
  {
    id: 5,
    symbol: "ETH",
    logo: "/brick.webp",
    amount: 121,
  },
]
const mapTokenData: TokensMap[] = testData

export default function ClaimTokens({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  open,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const [isSelfOpen, setSelfOpen] = useState(true)
  const [isDoneOpen, setDoneOpen] = useState(false)
  const [tokensClaimed, setTokensClaimed] = useState(0)
  const [tokenSymbol, setTokensSymbol] = useState("")

  function claimToken(token: TokensMap) {
    setTokensClaimed(token.amount)
    setTokensSymbol(token.symbol)
    setSelfOpen(false)
    setDoneOpen(true)
    console.log("I Claimed ", token.symbol)
  }
  return (
    <>
      {isDoneOpen && (
        <ModalDone
          title="Sucessfully Claimed"
          message={
            <p>
              You successfully claimed{" "}
              <strong>
                {tokensClaimed} {tokenSymbol}
              </strong>{" "}
              to your wallet
            </p>
          }
          action={setOpen}
        />
      )}
      {isSelfOpen && (
        <ClaimModal
          open={open}
          setOpen={setOpen}
          title={"Tokens"}
          description="This feature allows you to claim your Tokens
              and add them to the designed wallet. By doing this, you are redeeming all earnings from NFT's sellings"
        >
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
      )}
    </>
  )
}
