"use client"
import ClaimNFTCard from "@/components/cards/ClaimNFTCard"
import SeabrickNFTCard from "@/components/cards/SeabrickNFTCard"
import UserTransactionHistory, {
  UserTransactionHistoryData,
} from "@/components/cards/UserTransactionsHistory"
import ClaimTokens from "@/components/forms/ClaimTokens"
import Modal from "@/components/modals/Modal"
import Table from "@/components/table/TableTest"
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  UserIcon,
  // Cog6ToothIcon,
  // ArrowsUpDownIcon,
  // ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline"
import Image from "next/image"
import { useState } from "react"
export default function Dashboard() {
  // use state y toda esa paja
  const [isCardVisible, setIsCardVisible] = useState(false)
  const [dataOnDisplay, setDataOnDisplay] = useState("Transfers")
  const [isClaimTokenVisible, setClaimTokenVisible] = useState(false)
  //
  const testDataMap: UserTransactionHistoryData[] = [
    {
      total: 400,
      hash: "0x00000000000000000000000000000000000000000",
      type: "claimed",
      token: "SOL",
      amount: 4,
    },
    {
      total: 400,
      hash: "0x00000000000000000000000000000000000000000",
      type: "claimed",
      token: "SOL",
      amount: 3,
    },
    {
      total: 400,
      hash: "0x00000000000000000000000000000000000000000",
      type: "minted",
      amount: 417,
    },
    {
      total: 400,
      hash: "0x00000000000000000000000000000000000000000",
      type: "minted",
      amount: 208,
    },
  ]
  const isAdmin = true
  const loggedUserName = "Sebastian Rojas"
  const userName = loggedUserName

  // admin
  const totalSupply = 35
  //user
  const totalBalance = 3500
  const totalQuantity = 35
  const lastMontQuantity = isAdmin ? 5 : 100
  const thisMontQuantity = isAdmin ? 10 : 300
  //
  const differenceQuantity = thisMontQuantity - lastMontQuantity

  const columnDataTest = [
    { key: "hash", label: "TX Hash" },
    { key: "from_address", label: "From" },
    { key: "to_address", label: "To" },
    { key: "date", label: "Date" },
  ]

  const bodyDataTestBuys = [
    {
      hash: "0x0000000000000000000001",
      from_address: "Here Buys",
      to_address: "0x0000000000000000000003",
      date: "01/01/2024",
    },
    {
      hash: "0x0000000000000000000004",
      from_address: "0x0000000000000000000005",
      to_address: "0x0000000000000000000006",
      date: "01/01/2024",
    },
    {
      hash: "0x0000000000000000000007",
      from_address: "0x0000000000000000000008",
      to_address: "0x0000000000000000000009",
      date: "01/01/2024",
    },
    {
      hash: "0x0000000000000000000010",
      from_address: "0x0000000000000000000011",
      to_address: "0x0000000000000000000012",
      date: "01/01/2024",
    },
    {
      hash: "0x0000000000000000000013",
      from_address: "0x0000000000000000000014",
      to_address: "0x0000000000000000000015",
      date: "01/01/2024",
    },
    {
      hash: "0x0000000000000000000016",
      from_address: "0x0000000000000000000017",
      to_address: "0x0000000000000000000018",
      date: "01/01/2024",
    },
    {
      hash: "0x0000000000000000000019",
      from_address: "0x0000000000000000000020",
      to_address: "0x0000000000000000000021",
      date: "01/01/2024",
    },
    {
      hash: "0x0000000000000000000022",
      from_address: "0x0000000000000000000023",
      to_address: "0x0000000000000000000024",
      date: "01/01/2024",
    },
  ]
  const bodyDataTestTransfers = [
    {
      hash: "Here Transfers",
      from_address: "0x0000000000000000000002",
      to_address: "0x0000000000000000000003",
      date: "01/01/2024",
    },
    {
      hash: "0x0000000000000000000004",
      from_address: "0x0000000000000000000005",
      to_address: "0x0000000000000000000006",
      date: "01/01/2024",
    },
    {
      hash: "0x0000000000000000000007",
      from_address: "0x0000000000000000000008",
      to_address: "0x0000000000000000000009",
      date: "01/01/2024",
    },
    {
      hash: "0x0000000000000000000010",
      from_address: "0x0000000000000000000011",
      to_address: "0x0000000000000000000012",
      date: "01/01/2024",
    },
    {
      hash: "0x0000000000000000000013",
      from_address: "0x0000000000000000000014",
      to_address: "0x0000000000000000000015",
      date: "01/01/2024",
    },
    {
      hash: "0x0000000000000000000016",
      from_address: "0x0000000000000000000017",
      to_address: "0x0000000000000000000018",
      date: "01/01/2024",
    },
    {
      hash: "0x0000000000000000000019",
      from_address: "0x0000000000000000000020",
      to_address: "0x0000000000000000000021",
      date: "01/01/2024",
    },
    {
      hash: "0x0000000000000000000022",
      from_address: "0x0000000000000000000023",
      to_address: "0x0000000000000000000024",
      date: "01/01/2024",
    },
  ]

  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
  return (
    <>
      <Modal open={isClaimTokenVisible} setOpen={setClaimTokenVisible}>
        <ClaimTokens
          open={isClaimTokenVisible}
          setOpen={setClaimTokenVisible}
        />
      </Modal>
      <div className="w-full px-3">
        <div className="w-full justify-start items-center gap-2 inline-flex mb-4">
          {isAdmin ? (
            <div></div>
          ) : (
            <Image
              src={`/brick.png`}
              alt="user-image"
              height={45}
              width={48}
              className="rounded-[100px]"
            />
          )}
          <div className="h-[70px] flex-col justify-center items-start gap-px inline-flex">
            <div className="self-stretch text-[#666666] text-[9px] font-normal font-['Noto Sans']">
              Welcome Back!
            </div>
            <div className="text-black text-2xl font-normal font-['Noto Sans']">
              {userName}
            </div>
          </div>
        </div>
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
                      {totalSupply} Seabrick NFTs
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
                    <button className="p-2 bg-[#2069a0] hover:bg-[#17548b] active:bg-[#4290d6] rounded-[5px] justify-start items-center gap-2.5 flex text-right text-white text-xs font-normal font-['Noto Sans']">
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
                    {differenceQuantity === 0
                      ? ""
                      : Math.abs(differenceQuantity)}{" "}
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
              <UserTransactionHistory data={testDataMap} />
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
                    <button className="p-2 bg-[#333333] hover:bg-[#555555] active:bg-[#222222] text-[white] rounded-[5px] text-left">
                      <ArrowsRightLeftIcon className="size-[1.25rem] inline mx-2 mt-[-3px]" />
                      Transfer Ownership
                    </button>
                    <button className="p-2 bg-[#333333] hover:bg-[#555555] active:bg-[#222222] text-[white] rounded-[5px] text-left">
                      <UserIcon className="size-[1.25rem] inline mx-2 mt-[-3px]" />
                      Admins
                    </button>
                    <button
                      className="p-2 bg-[#2069a0] hover:bg-[#17548b] active:bg-[#4290d6] text-[white] rounded-[5px] text-left"
                      onClick={() => setClaimTokenVisible(true)}
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
                      <div className="bg-white rounded-[5px] absolute h-[50px] w-[120px] flex flex-col divide-y border border-[#babcc3]/30">
                        <button
                          className="text-start text-sm px-3 h-1/2"
                          onClick={() => {
                            setIsCardVisible(false)
                            setDataOnDisplay("Buys")
                          }}
                        >
                          Buys
                        </button>
                        <button
                          className="text-start text-sm px-3 h-1/2"
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
                    columns={columnDataTest}
                    data={
                      dataOnDisplay == "Transfers"
                        ? bodyDataTestTransfers
                        : bodyDataTestBuys
                    }
                    fontSize="0.6rem"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
