"use client"
import Image from "next/image"
import Table from "@/components/table/TableTest"
import { useRouter } from "next/navigation"
import BackButton from "@/components/buttons/BackButton"
export default function OrderDetailsMain() {
  const router = useRouter()
  const columnDataTest = [
    { key: "tokenId", label: "Token Id" },
    { key: "status", label: "Status" },
    { key: "hash", label: "TX Hash" },
    { key: "date", label: "Date" },
  ]

  const bodyDataTest = [
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
  ]
  return (
    <>
      <div className="flex justify-center">
        <div className="max-w-[978px] w-[80%] flex flex-col items-center mx-auto mt-[30px] relative">
          <div className="absolute top-4 left-4">
            <BackButton />
          </div>
          <h2 className="text-black text-3xl font-normal font-['Noto Sans'] text-center mb-8">
            Order Details
          </h2>
          <div className=" min-w-[200px] box-content p-6 bg-white rounded-[10px] justify-center items-center gap-2.5 flex m-auto flex-col mb-4 w-full">
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
            <div className="mb-4 w-full">
              <Table columns={columnDataTest} data={bodyDataTest} />
            </div>
          </div>
          <div className="h-[45px] justify-end w-full gap-4 flex">
            <button className="self-stretch p-[17px] bg-[#333333] rounded-[5px] justify-start items-center gap-2.5 flex">
              <div
                className="text-right text-white text-sm font-normal font-['Noto Sans']"
                onClick={() => router.back()}
              >
                Go Back
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
