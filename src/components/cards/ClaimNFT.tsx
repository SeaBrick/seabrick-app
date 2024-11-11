import { Dispatch, SetStateAction, useState } from "react"
import ClaimModal from "../modals/ClaimModal"
import Table, { TableColumn } from "../table/TableTest"
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon"
import Image from "next/image"
import { ModalDone } from "../modals/ModalDone"
import SubmitButton from "../buttons/SubmitButton"

const dataTestColums: TableColumn[] = [
  {
    label: "Token ID",
    key: "tokenId",
  },
  { label: "Status", key: "status" },
  { label: "Date", key: "date" },
]

const dataTestBody = [
  {
    tokenId: 2,
    status: "Claimed",
    date: "05/11/2024",
  },
  {
    tokenId: 2,
    status: "Claimed",
    date: "05/11/2024",
  },
  {
    tokenId: 2,
    status: "Claimed",
    date: "05/11/2024",
  },
  {
    tokenId: 2,
    status: "Claimed",
    date: "05/11/2024",
  },
  {
    tokenId: 2,
    status: "Claimed",
    date: "05/11/2024",
  },
  {
    tokenId: 2,
    status: "Claimed",
    date: "05/11/2024",
  },
  {
    tokenId: 2,
    status: "Claimed",
    date: "05/11/2024",
  },
]

const dataColumns: TableColumn[] = dataTestColums
const dataBody = dataTestBody
const tokenNumber = "1234"
export default function ClaimTokens({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  open,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const [nftClaimed, setNftClaimed] = useState("")
  const [isSelfOpen, setSelfOpen] = useState(true)
  const [isDoneOpen, setDoneOpen] = useState(false)

  function claimNFT(formData: FormData) {
    console.log("I claimed my nft number", formData.get("tokenNumber"))
    setNftClaimed(tokenNumber.toString())
    setSelfOpen(false)
    setDoneOpen(true)
  }
  return (
    <>
      {isDoneOpen && (
        <ModalDone
          title="Sucessfully Claimed"
          message={
            <p>
              You successfully claimed <strong>{nftClaimed}</strong> to your
              wallet
            </p>
          }
          action={setOpen}
        />
      )}
      {isSelfOpen && (
        <ClaimModal open={open} setOpen={setOpen} title={"NFTs"}>
          <div className="gap-2 flex flex-col overflow-y-auto">
            <Table columns={dataColumns} data={dataBody} fontSize="0.7rem" />
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 grow shrink rounded-[5px] border border-[#babcc3]/60 justify-start items-center gap-2.5 inline-flex ">
              <div className="rounded-[100px] bg-slate-200 h-[20px] w-[20px] flex justify-center items-center">
                <Image
                  src={`/brick.png`}
                  alt={`BRC`}
                  height={20}
                  width={20}
                  className="h-[20px] w-[20px] object-scale-down"
                />
              </div>
              <div className="text-sm text-[#333333]">ID #{tokenNumber}</div>
              <div className="text-sm font-bold">Seabrick NFT</div>
            </div>
            <form action={claimNFT}>
              <input value={tokenNumber} name="tokenNumber" type="hidden" />
              <SubmitButton
                buttonIcon={
                  <CurrencyDollarIcon className="size-[1.5rem] inline mr-[-3px] " />
                }
                buttonClass="bg-[#2069a0] hover:bg-[#17548b] active:bg-[#4290d6] rounded-[5px] p-2.5 text-white text-sm"
                label="Claim Available Tokens"
              />
            </form>
          </div>
        </ClaimModal>
      )}
    </>
  )
}
