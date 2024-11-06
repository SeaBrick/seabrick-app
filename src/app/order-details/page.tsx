"use client"
import Image from "next/image"
import Table from "@/components/table/TableTest"
import { useRouter } from "next/navigation"
export default function OrderDetailsMain() {
  const router = useRouter()
  return (
    <>
      <h2 className="text-black text-3xl font-normal font-['Noto Sans'] text-center mb-8">
        Order Details
      </h2>
      <div className="w-3/4 min-w-[200px] max-w-[978px] box-content p-6 bg-white rounded-[10px] justify-center items-center gap-2.5 flex m-auto flex-col mb-4">
        <div className="self-stretch h-auto flex-col justify-start items-start gap-6 flex">
          <div className="self-stretch justify-start items-center gap-4 inline-flex">
            <Image
              className="w-[65px] h-[62px]"
              src={`/brick.png`}
              alt="logo"
              width={65}
              height={62}
            />
            <div className="flex-col justify-between items-start inline-flex">
              <div className="justify-start items-center gap-2.5 inline-flex">
                <div className="text-[#8a8a8f] text-[15px] font-normal font-['Noto Sans']">
                  Seabrick NFT
                </div>
              </div>
              <div className="self-stretch justify-start items-end gap-2.5 inline-flex text-[#323232] text-4xl font-normal font-['Noto Sans'] w-auto">
                <span>100,00 US$</span>
              </div>
            </div>
          </div>
        </div>
        <Table
          columns={[
            { key: "tokenId", label: "Token Id" },
            { key: "status", label: "Status" },
            { key: "hash", label: "TX Hash" },
            { key: "date", label: "Date" },
          ]}
          data={[
            {
              tokenId: 2,
              status: "true",
              hash: "0x0000000000000000000",
              date: "01/01/2024",
            },
            {
              tokenId: 3,
              status: "cccc",
              hash: "0x1000000000000000000",
              date: "01/02/2024",
            },
            {
              tokenId: 4,
              status: "asdasd",
              hash: "0x0001000000000000000000",
              date: "01/03/2024",
            },
          ]}
        />
      </div>
      <div className="h-[45px] justify-end items-end gap-4 flex m-auto w-[80vw]">
        <button className="self-stretch p-[17px] bg-[#333333] rounded-[5px] justify-start items-center gap-2.5 flex">
          <div
            className="text-right text-white text-sm font-normal font-['Noto Sans']"
            onClick={() => router.back()}
          >
            Go Back
          </div>
        </button>
      </div>
    </>
  )
}
