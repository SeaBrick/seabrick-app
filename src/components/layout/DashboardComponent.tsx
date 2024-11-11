import {
  UserIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import ClaimTokens from "../cards/ClaimNFT"
import ClaimNFTCard from "../cards/ClaimNFTCard"
import SeabrickNFTCard from "../cards/SeabrickNFTCard"
import UserTransactionHistory, {
  UserTransactionHistoryData,
} from "../cards/UserTransactionsHistory"
import { MintTokensModal } from "../modals/MintTokensModal"
import Modal from "../modals/Modal"
import ModalTransferOwnership from "../modals/ModalTransferOwnership"
import Table from "../table/TableTest"
import { useState } from "react"
import { useContractContext } from "@/context/contractContext"
import { Buy, Transfer } from "@/lib/interfaces"

interface ModalProps {
  userTransactionData: UserTransactionHistoryData[]
  dataBuys: Buy[]
  dataTransfer: Transfer[]
  isAdmin: boolean
}

export default function DashboardComponent({
  userTransactionData,
  dataBuys,
  dataTransfer,
  isAdmin,
}: ModalProps) {
  const [dataOnDisplay, setDataOnDisplay] = useState("Transfers")
  const [isCardVisible, setIsCardVisible] = useState(false)
  const [isClaimTokensOpen, setClaimTokensOpen] = useState(false)
  const [isMintTokensOpen, setMintTokensOpen] = useState(false)
  const router = useRouter()
  //
  const {
    data: { seabrick },
  } = useContractContext()

  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
  //

  const columnBuyInterface = [
    { key: "tokenId", label: "Token Id" },
    { key: "buyer", label: "From" },
    { key: "transactionHash", label: "TX Hash" },
    { key: "blockNumber", label: "Block Number" },
    { key: "to_address", label: "To" },
    { key: "blockTimestamp", label: "Date" },
  ]

  const columnTransferInterface = [
    { key: "id", label: "TX Hash" },
    { key: "tokenId", label: "Token Id" },
    { key: "transactionHash", label: "TX Hash" },
    { key: "blockNumber", label: "Block Number" },
    { key: "from", label: "From" },
    { key: "to", label: "To" },
    { key: "blockTimestamp", label: "Date" },
  ]
  // TODO: Conectar
  const totalBalance = 3500
  const totalQuantity = 35
  const lastMontQuantity = isAdmin ? 5 : 100
  const thisMontQuantity = isAdmin ? 10 : 300
  const differenceQuantity = thisMontQuantity - lastMontQuantity

  //
  return (
    <>
      {isAdmin ? (
        <>
          <Modal open={isClaimTokensOpen} setOpen={setClaimTokensOpen}>
            <ClaimTokens
              open={isClaimTokensOpen}
              setOpen={setClaimTokensOpen}
            />
          </Modal>
          <Modal open={isMintTokensOpen} setOpen={setMintTokensOpen}>
            <MintTokensModal
              open={isMintTokensOpen}
              setOpen={setMintTokensOpen}
            />
          </Modal>
        </>
      ) : (
        ""
      )}
      <div className="w-full gap-3 flex md:flex-row flex-col">
        {/* left side */}
        <div className=" w-full md:w-1/3 lg:w-1/4 p-6 bg-white rounded-[10px] justify-start items-center gap-2.5 flex flex-col">
          <div className="flex-col justify-start items-start gap-3 inline-flex w-full mb-4">
            {/* top with texts */}
            <div className="self-stretch flex-col justify-between items-start inline-flex">
              <div className="justify-start items-center gap-2.5 inline-flex">
                <div className="text-[#8a8a8f] text-xs font-normal font-['Noto Sans']">
                  Total {isAdmin ? "Supply" : "Balance"}
                </div>
              </div>
              <div className="self-stretch justify-start items-end gap-2.5 inline-flex">
                {isAdmin ? (
                  <div className="text-[#333333] text-xl font-normal font-['Noto Sans']">
                    {seabrick.totalSupply} Seabrick NFTs
                  </div>
                ) : (
                  <div className="text-[#333333] text-xl font-normal font-['Noto Sans'] flex gap-2">
                    {USDollar.format(totalBalance)}
                    <div className="text-[#8a8a8f] text-[0.6rem] font-normal font-['Noto Sans']">
                      {totalQuantity} Seabrick NFTs
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* bottom with button */}
            <div className="justify-start items-center gap-2 inline-flex">
              {isAdmin ? (
                <div className="justify-start items-center gap-2 flex">
                  <button
                    className="p-2 bg-[#2069a0] hover:bg-[#17548b] active:bg-[#4290d6] rounded-[5px] justify-start items-center gap-2.5 flex text-right text-white text-xs font-normal font-['Noto Sans']"
                    onClick={() => setMintTokensOpen(true)}
                  >
                    Mint New Tokens
                  </button>
                </div>
              ) : (
                <div className="flex flex-start w-full gap-2">
                  <button className="p-2 bg-[#333333] hover:bg-[#555555] active:bg-[#222222] rounded-[5px] justify-start items-center gap-2.5 flex text-right text-white text-xs font-normal font-['Noto Sans']">
                    Claim!
                  </button>
                  <button className="p-2 bg-[#2069a0] hover:bg-[#17548b] active:bg-[#4290d6] rounded-[5px] justify-start items-center gap-2.5 flex text-right text-white text-xs font-normal font-['Noto Sans']">
                    Buy
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* left bottom */}
          <div className="flex-col justify-start items-start gap-4 inline-flex w-full">
            {/*  filter and description  */}
            <div className="flex-col justify-start items-start gap-2 flex">
              {/* filter and date  */}
              <div className="self-stretch justify-start items-center gap-[5px] inline-flex">
                <div className="text-[#8a8a8f] text-xs font-normal font-['Noto Sans']">
                  {isAdmin ? "Minted Tokens" : "Transactions"}
                </div>
                <div className="justify-start items-center gap-[3px] flex">
                  <div className="text-[#333333] text-xs font-normal font-['Noto Sans']">
                    November 2024
                    {/* calendar??? */}
                  </div>
                </div>
              </div>
              {/* small stats */}
              <div className="self-stretch justify-start items-center gap-4 inline-flex">
                <div className="text-[#333333] text-l font-normal font-['Noto Sans']">
                  {thisMontQuantity > 0 ? "+" : ""}
                  {isAdmin
                    ? thisMontQuantity
                    : USDollar.format(thisMontQuantity)}
                </div>
                <div className="text-[#8a8a8f] text-xs font-normal font-['Noto Sans']">
                  This is{" "}
                  {differenceQuantity === 0 ? "" : Math.abs(differenceQuantity)}{" "}
                  {differenceQuantity > 0
                    ? "more"
                    : differenceQuantity === 0
                      ? "the same"
                      : "less"}{" "}
                  than last month
                </div>
              </div>
            </div>
            {/* mapping */}
            <UserTransactionHistory data={userTransactionData} />
          </div>
        </div>
        {/* right side */}
        <div className=" w-full md:w-2/3 lg:w-3/4 flex gap-3 flex-col">
          {/* cards div  */}
          <div className="flex w-full gap-3 lg:flex-row flex-col">
            <div className="lg:w-[50%] w-full">
              <SeabrickNFTCard />
            </div>
            <div className="lg:w-[50%] w-full min-h-[10rem] gap-2 flex flex-col">
              {isAdmin ? (
                <div className="bg-white w-full h-full rounded-[10px] gap-3 p-4 flex flex-col justify-between">
                  <ModalTransferOwnership />
                  <button
                    className="p-2 bg-[#333333] hover:bg-[#555555] active:bg-[#222222] text-[white] rounded-[5px] text-left"
                    onClick={() => {
                      router.push("/admin-list")
                    }}
                  >
                    <UserIcon className="size-[1.25rem] inline mx-2 mt-[-3px]" />
                    Admins
                  </button>
                  <button
                    className="p-2 bg-[#2069a0] hover:bg-[#17548b] active:bg-[#4290d6] text-[white] rounded-[5px] text-left"
                    onClick={() => setClaimTokensOpen(true)}
                  >
                    <CurrencyDollarIcon className="size-[1.25rem] inline mx-2 mt-[-3px]" />
                    Claim Earnings
                  </button>
                </div>
              ) : (
                <ClaimNFTCard />
              )}
            </div>
          </div>
          {/* tables div */}
          <div className="flex w-full h-full gap-3 min-w-fit flex-col xl:flex-row">
            <div className="bg-white rounded-[10px] h-full w-full p-3">
              <div className="px-6 h-[4.5rem] mb-[-1rem] justify-between items-center flex">
                <div
                  className="text-black text-[17px] font-normal relative  hover:cursor-pointer"
                  onClick={() => setIsCardVisible(!isCardVisible)}
                >
                  <span className="text-[#8a8a8f]">Latest </span>
                  {dataOnDisplay}
                  <ChevronDownIcon className="size-[0.7rem] inline ml-1" />
                  {isCardVisible ? (
                    <div className="bg-white rounded-[1px] absolute h-min w-[120px] flex flex-col divide-y border border-[#babcc3]/30">
                      <button
                        className="text-start text-sm px-3 h-1/2 p-1"
                        onClick={() => {
                          setIsCardVisible(false)
                          setDataOnDisplay("Buys")
                        }}
                      >
                        Buys
                      </button>
                      <button
                        className="text-start text-sm px-3 h-1/2 p-1"
                        onClick={() => {
                          setIsCardVisible(false)
                          setDataOnDisplay("Transfers")
                        }}
                      >
                        Transfers
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <a
                  href="/" // TODO: Add url to lastes??
                  className="w-[30px] h-[30px] rounded-full border border-[#9b9a9b]/60 flex justify-center items-center hover:bg-slate-50 active:bg-slate-200"
                >
                  <ArrowUpRightIcon className="size-[0.7rem]" />
                </a>
              </div>
              <div className="h-fit bg-[#efeff4] mt-3">
                <Table
                  columns={
                    dataOnDisplay == "Transfers"
                      ? columnTransferInterface
                      : columnBuyInterface
                  }
                  data={dataOnDisplay == "Transfers" ? dataTransfer : dataBuys}
                  fontSize="0.6rem"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}