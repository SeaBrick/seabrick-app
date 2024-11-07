import ClaimNFTCard from "@/components/cards/ClaimNFTCard"
import SeabrickNFTCard from "@/components/cards/SeabrickNFTCard"
import UserTransactionHistory, {
  UserTransactionHistoryData,
} from "@/components/cards/UserTransactionsHistory"
import Table from "@/components/table/TableTest"
import { ArrowUpRightIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
export default function Dashboard() {
  // use state y toda esa paja
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
  const isAdmin = false
  const loggedUserName = "Sebastian Rojas"
  const userName = isAdmin ? "Admin Panel" : loggedUserName
  const lastMontQuantity = 5
  const thisMontQuantity = 10
  const differenceQuantity = thisMontQuantity - lastMontQuantity
  const totalSupply = 35

  const columnDataTest = [
    { key: "hash", label: "TX Hash" },
    { key: "from_address", label: "From" },
    { key: "to_address", label: "To" },
    { key: "date", label: "Date" },
  ]

  const bodyDataTest = [
    {
      hash: "0x0000000000000000000001",
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
  return (
    <>
      <div className="w-full px-3">
        <div className="w-full justify-start items-center gap-2 inline-flex mb-4">
          <Image
            src={`/brick.png`}
            alt="user-image"
            height={45}
            width={48}
            className="rounded-[100px]"
          />
          <div className="h-[70px] flex-col justify-center items-start gap-px inline-flex">
            <div className="self-stretch text-[#666666] text-[9px] font-normal font-['Noto Sans']">
              Welcome Back!
            </div>
            <div className="text-black text-2xl font-normal font-['Noto Sans']">
              {userName}
            </div>
          </div>
        </div>
        <div className="w-full gap-3 flex">
          {/* left side */}
          <div className="w-1/4 p-6 bg-white rounded-[10px] justify-start items-center gap-2.5 flex flex-col">
            <div className="flex-col justify-start items-start gap-3 inline-flex w-full mb-4">
              {/* top with texts */}
              <div className="self-stretch flex-col justify-between items-start inline-flex">
                <div className="justify-start items-center gap-2.5 inline-flex">
                  <div className="text-[#333333] text-xs font-normal font-['Noto Sans']">
                    Total Supply
                  </div>
                </div>
                <div className="self-stretch justify-start items-end gap-2.5 inline-flex">
                  <div className="text-[#333333] text-xl font-normal font-['Noto Sans']">
                    {totalSupply} Seabrick NFTs
                  </div>
                </div>
              </div>
              {/* bottom with button */}
              <div className="justify-start items-center gap-2 inline-flex">
                <div className="justify-start items-center gap-2 flex">
                  <button className="p-2 bg-[#2069a0] rounded-[5px] justify-start items-center gap-2.5 flex text-right text-white text-xs font-normal font-['Noto Sans']">
                    Mint New Tokens
                  </button>
                </div>
              </div>
            </div>
            {/* left bottom */}
            <div className="flex-col justify-start items-start gap-4 inline-flex w-full">
              {/*  filter and description  */}
              <div className="flex-col justify-start items-start gap-2 flex">
                {/* filter and date  */}
                <div className="self-stretch justify-start items-center gap-[5px] inline-flex">
                  <div className="text-[#8a8a8f] text-xs font-normal font-['Noto Sans']">
                    Minted Tokens
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
                    {thisMontQuantity}
                  </div>
                  <div className="text-[#8a8a8f] text-xs font-normal font-['Noto Sans']">
                    This is {differenceQuantity === 0 ? "" : differenceQuantity}{" "}
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
          <div className="w-3/4 flex gap-3 flex-col">
            {/* cards div  */}
            <div className="flex w-full gap-3">
              <div className="w-[50%]">
                <SeabrickNFTCard />
              </div>
              <div className="w-[50%]">
                <ClaimNFTCard />
              </div>
            </div>
            {/* tables div */}
            <div className="flex w-full h-full gap-3 min-w-fit">
              <div className="bg-white rounded-[10px] h-full  w-[50%]">
                <div className="px-6 h-[4.5rem] mb-[-1rem] justify-between items-center flex">
                  <div className="text-black text-[17px] font-normal">
                    Latest Buys
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
                    data={bodyDataTest}
                    fontSize="0.6rem"
                  />
                </div>
              </div>
              <div className="bg-white rounded-[10px] h-full w-[50%]">
                <div className="px-6 h-[4.5rem] mb-[-1rem] justify-between items-center flex">
                  <div className="text-black text-[17px] font-normal">
                    Latest Buys
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
                    data={bodyDataTest}
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
