import { Dispatch, SetStateAction, useEffect, useState } from "react"
import ClaimModal from "../modals/ClaimModal"
import Table, { TableColumn } from "../table/TableTest"
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon"
import Image from "next/image"
import { ModalDone } from "../modals/ModalDone"
import SubmitButton from "../buttons/SubmitButton"
import { claimToken, getClaimedTokens } from "@/app/dashboard/requests"
import PageLoaderSpinner from "../spinners/PageLoaderSpinner"

const dataTestColums: TableColumn[] = [
  {
    label: "Token ID",
    key: "token_id",
  },
  { label: "Status", key: "claimed" },
  { label: "Date", key: "created_at" },
]
const dataColumns: TableColumn[] = dataTestColums
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
  const [nftClaimedList, setNftClaimedList] = useState<TableColumn[]>([])
  const [isLoading, setLoading] = useState(false)

  async function claimNFT(formData: FormData) {
    try {
      await claimToken()
      setSelfOpen(false)
      setDoneOpen(true)
      setNftClaimed(tokenNumber.toString())
      console.log("I claimed my nft number", formData.get("tokenNumber"))
    } catch (error) {
      console.log(error)
    }
  }
  //
  useEffect(() => {
    setLoading(true)
    fetchData()
  }, [])
  //
  const fetchData = async () => {
    const result = await getClaimedTokens()
    setNftClaimedList(result.data)
    setLoading(false)
  }
  //
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
            {isLoading ? (
              <PageLoaderSpinner height="h-max" width="w-1/2" />
            ) : (
              nftClaimedList.length > 0 && (
                <Table
                  columns={dataColumns}
                  data={nftClaimedList}
                  fontSize="0.7rem"
                />
              )
            )}
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
