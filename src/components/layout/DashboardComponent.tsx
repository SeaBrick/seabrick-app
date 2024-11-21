import {
  UserIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  ArrowUpRightIcon,
  AtSymbolIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline"
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
import ClaimNFT from "../cards/ClaimNFT"
import Link from "next/link"
import Image from "next/image"

interface ModalProps {
  userTransactionData: UserTransactionHistoryData[]
  dataBuys: Buy[]
  dataTransfer: Transfer[]
  isAdmin: boolean
  isOwner?: boolean
}

export default function DashboardComponent({
  userTransactionData,
  dataBuys,
  dataTransfer,
  isAdmin,
  isOwner = false,
}: ModalProps) {
  const [dataOnDisplay, setDataOnDisplay] = useState("Transfers")
  const [isCardVisible, setIsCardVisible] = useState(false)
  const [isClaimTokensOpen, setClaimTokensOpen] = useState(false)
  const [isMintTokensOpen, setMintTokensOpen] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [transferOwnerOpen, setTransferOwnerOpen] = useState(false)

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
    { key: "buyer", label: "Buyer" },
    { key: "transactionHash", label: "TX Hash" },
    { key: "blockNumber", label: "Block Number" },
    { key: "blockTimestamp", label: "Date" },
  ]

  const columnTransferInterface = [
    { key: "id", label: "TX Hash" },
    { key: "tokenId", label: "Token Id" },
    { key: "transactionHash", label: "TX Hash" },
    { key: "blockNumber", label: "Block Number" },
    { key: "from", label: "From" },
    { key: "to", label: "To" },
    { key: "blockTimestamp", label: "Time" },
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
          <Modal open={transferOwnerOpen} setOpen={setTransferOwnerOpen}>
            <ModalTransferOwnership
              open={transferOwnerOpen}
              setOpen={setTransferOwnerOpen}
            />
          </Modal>
        </>
      ) : (
        <Modal open={showClaimModal} setOpen={setShowClaimModal}>
          <ClaimNFT open={showClaimModal} setOpen={setShowClaimModal} />
        </Modal>
      )}
      <div className="w-full gap-3 flex md:flex-row flex-col">
        {/* left side */}
        <div className=" w-full md:w-1/3 lg:w-1/4 p-6 bg-white rounded-[10px] justify-start items-center gap-2.5 flex flex-col">
          <div className="flex-col justify-start items-start gap-3 inline-flex w-full mb-4">
            {/* top with texts */}
            <div className="self-stretch flex-col justify-between items-start inline-flex">
              <div className="justify-start items-center gap-2.5 inline-flex">
                <div className="text-[#8a8a8f] text-base font-normal font-['Noto Sans']">
                  Total {isAdmin ? "Supply" : "Balance"}
                </div>
              </div>
              <div className="self-stretch justify-start items-end gap-2.5 inline-flex">
                {isAdmin ? (
                  <div className="text-[#333333] text-3xl font-normal font-['Noto Sans']">
                    {seabrick.totalSupply} Seabrick NFTs
                  </div>
                ) : (
                  <div className="text-[#333333] text-3xl font-normal font-['Noto Sans'] flex gap-2">
                    {USDollar.format(totalBalance)}
                    <div className="text-[#8a8a8f] text-sm font-normal font-['Noto Sans']">
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
                    className="p-2 bg-[#2069a0] hover:bg-[#17548b] active:bg-[#4290d6] rounded-[5px] justify-start items-center gap-2.5 flex text-right text-white text-base font-normal font-['Noto Sans'] disabled:cursor-not-allowed disabled:bg-gray-400"
                    onClick={() => setMintTokensOpen(true)}
                    disabled={!isAdmin}
                  >
                    Mint New Tokens
                  </button>
                </div>
              ) : (
                <div className="flex flex-start w-full gap-2">
                  <button
                    className="px-4 py-2 bg-[#333333] hover:bg-[#555555] active:bg-[#222222] rounded-[5px] justify-start items-center gap-2.5 flex text-right text-white text-base font-normal font-['Noto Sans']"
                    onClick={() => setShowClaimModal(true)}
                  >
                    Claim!
                  </button>
                  <Link
                    className="px-6 py-2 bg-[#2069a0] hover:bg-[#17548b] active:bg-[#4290d6] rounded-[5px] justify-start items-center gap-2.5 flex text-right text-white text-base font-normal font-['Noto Sans']"
                    href={`/buy`}
                    prefetch={true}
                  >
                    Buy
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* left bottom */}
          <div className="flex-col justify-start items-start gap-4 inline-flex w-full">
            {/*  filter and description  */}
            <div className="flex-col justify-start items-start gap-2 flex">
              {/* filter and date  */}
              <div className="self-stretch justify-start items-center gap-[5px] flex flex-wrap">
                <div className="text-[#8a8a8f] text-base font-normal font-['Noto Sans']">
                  {isAdmin ? "Minted Tokens" : "Transactions"}
                </div>
                <div className="justify-start items-center gap-[3px] flex">
                  <div className="text-[#333333] text-base font-normal font-['Noto Sans']">
                    November 2024
                    {/* calendar??? */}
                  </div>
                </div>
              </div>
              {/* small stats */}
              <div className="self-stretch justify-start items-center gap-4 inline-flex">
                <div className="text-[#333333] text-2xl font-normal font-['Noto Sans']">
                  {thisMontQuantity > 0 ? "+" : ""}
                  {isAdmin
                    ? thisMontQuantity
                    : USDollar.format(thisMontQuantity)}
                </div>
                <div className="text-[#8a8a8f] text-sm font-normal font-['Noto Sans']">
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
                <div className="bg-white w-full h-full rounded-[10px] gap-x-3 gap-y-6 p-6 grid grid-cols-2 justify-between">
                  <div className="justify-start items-center gap-2 flex col-span-2">
                    <button
                      className="p-2 bg-[#2069a0] hover:bg-[#17548b] active:bg-[#4290d6] text-[white] rounded-[5px] text-center w-full h-full disabled:cursor-not-allowed disabled:bg-gray-400 text-lg"
                      onClick={() => setTransferOwnerOpen(true)}
                      disabled={!isOwner}
                    >
                      <ArrowsRightLeftIcon className="size-[1.5rem] inline mx-2 mt-[-3px]" />
                      Transfer Ownership
                    </button>
                  </div>
                  <Link
                    className="p-2 bg-[#333333] hover:bg-[#555555] active:bg-[#222222] text-[white] rounded-[5px] text-xl flex items-center"
                    href="/admin-list"
                  >
                    <UserIcon className="size-[1.5rem] inline mx-2 mt-[-3px]" />
                    <span>Admins</span>
                  </Link>
                  {/* <button
                    className="p-2 bg-[#2069a0] hover:bg-[#17548b] active:bg-[#4290d6] text-[white] rounded-[5px] text-left text-xl"
                    onClick={() => setClaimTokensOpen(true)}
                  >
                    <CurrencyDollarIcon className="size-[1.5rem] inline mx-2 mt-[-3px]" />
                    Claim Earnings
                  </button> */}
                  <Link
                    className="p-2 bg-[#333333] hover:bg-[#555555] active:bg-[#222222] text-[white] rounded-[5px] text-xl flex items-center"
                    href="/admin/template"
                  >
                    <AtSymbolIcon className="size-[1.5rem] inline mx-2 mt-[-3px]" />
                    <span>Email template</span>
                  </Link>
                </div>
              ) : (
                <ClaimNFTCard />
              )}
            </div>
          </div>
          {/* tables div */}
          <div className="flex w-full h-full gap-3 flex-col xl:flex-row">
            <div className="bg-white rounded-[10px] h-full w-full p-3">
              <div className="px-6 h-[4.5rem] mb-[-1rem] justify-between items-center flex">
                <div
                  className="text-black text-[17px] font-normal relative  hover:cursor-pointer"
                  onClick={() => setIsCardVisible(!isCardVisible)}
                >
                  <span className="text-[#8a8a8f] text-xl">Latest </span>
                  <span className="text-xl">{dataOnDisplay}</span>
                  <ChevronDownIcon className="size-[1.25rem] inline ml-1" />
                  {isCardVisible ? (
                    <div className="bg-white rounded-[5px] absolute h-min w-[150px] flex flex-col divide-y border border-[#babcc3]/30">
                      <button
                        className="text-start text-lg px-3 h-1/2 p-1"
                        onClick={() => {
                          setIsCardVisible(false)
                          setDataOnDisplay("Buys")
                        }}
                      >
                        Buys
                      </button>
                      <button
                        className="text-start text-lg px-3 h-1/2 p-1"
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
                  href="/dashboard"
                  className="w-[30px] h-[30px] rounded-full border border-[#9b9a9b]/60 flex justify-center items-center hover:bg-slate-100 active:bg-slate-200"
                >
                  <ArrowUpRightIcon className="size-[0.7rem]" />
                </a>
              </div>
              {dataOnDisplay.length > 0 ?(
              <div className="h-fit bg-[#efeff4] mt-3">
                <Table
                  columns={
                    dataOnDisplay == "Transfers"
                      ? columnTransferInterface
                      : columnBuyInterface
                  }
                  data={dataOnDisplay == "Transfers" ? dataTransfer : dataBuys}
                />
              </div>
              ):(
                <div className="w-full h-fit flex flex-col justify-center text-center gap-1">
                  <Image
                    src={`/empty.webp`}
                    alt="user-image"
                    height={120}
                    width={120}
                    className="m-auto"
                  />                  
                  <strong>No Transactions yet</strong>
                </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
