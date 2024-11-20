import { Dispatch, SetStateAction, useEffect, useState } from "react"
import ClaimModal from "../modals/ClaimModal"
import Table, { TableColumn } from "../table/TableTest"
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon"
import Image from "next/image"
import { ModalDone } from "../modals/ModalDone"
import SubmitButton from "../buttons/SubmitButton"
import { claimToken, getClaimedTokens } from "@/app/dashboard/requests"
import LoadingDots from "../spinners/LoadingDots"
import LoadingBricks from "../spinners/LoadingBricks"
import Link from "next/link"

const dataColumns: TableColumn[] = [
  {
    label: "Token ID",
    key: "token_id",
  },
  { label: "Status", key: "claimed" },
  { label: "Date", key: "created_at" },
]
interface ClaimedTokensInterface {
  token_id: number | string
  claimed: boolean
  created_at: string | Date
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
  const [isSelfOpen, setSelfOpen] = useState(true)
  const [isDoneOpen, setDoneOpen] = useState(false)
  const [nftClaimedList, setNftClaimedList] = useState<
    ClaimedTokensInterface[]
  >([])
  const [isLoading, setLoading] = useState(false)
  const [disabledClaim, setDisabledClaim] = useState(true)

  async function claimNFT(_formData: FormData) {
    try {
      await claimToken()
      setSelfOpen(false)
      setDoneOpen(true)
      console.log("I claimed my nft")
    } catch (error) {
      console.log(error)
    }
  }
  //
  useEffect(() => {
    setLoading(true)
    setDisabledClaim(true)
    fetchData()
  }, [])
  //
  const fetchData = async () => {
    const result = await getClaimedTokens()
    console.log(result)
    setNftClaimedList(result.data)
    setDisabledClaim(
      (result.data as Array<{ claimed: boolean }>).every(
        (d) => d.claimed === true
      ) || result.data.length === 0
    )
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
              You successfully claimed a <strong>Seabrick Token NFT</strong> to
              your wallet
            </p>
          }
          action={setOpen}
        />
      )}
      {isSelfOpen && (
        <ClaimModal
          open={open}
          setOpen={setOpen}
          title={"NFTs"}
          description="This feature allows you to claim your NFTs (non-fungible tokens)
              and add them to your digital wallet. By claiming your NFTs, you
              can unlock unique digital assets that are uniquely yours."
        >
            {isLoading ? (
            <div className="gap-2 flex flex-col min-h-[150px] h-[fit-content] overflow-y-hidden">
              {/* <LoadingDots /> */}
              <LoadingBricks />
              </div>
            ) : (              
              <div className="gap-2 flex flex-col overflow-y-auto">
              {nftClaimedList.length > 0 ? (
                <Table
                  columns={dataColumns}
                  data={nftClaimedList}
                  textExtraClasses="text-[0.7rem]"
                />
              ):
              (<>
                <div className="w-full h-full flex flex-col justify-center gap-1">
                  <Image
                    src={`/empty.webp`}
                    alt="user-image"
                    height={120}
                    width={120}
                    className="m-auto"
                  />
                  <strong>No Tokens yet :c</strong>
                  <span>Fortunately, it is very easy to get ones C:</span>
                  <Link
                    className="m-auto px-6 py-2 bg-[#2069a0] hover:bg-[#17548b] active:bg-[#4290d6] rounded-[5px] justify-center items-center gap-2.5 flex text-center text-white text-base font-normal font-['Noto Sans']"
                    href={`/buy`}
                    prefetch={true}
                  >
                    Buy
                  </Link>
                </div>
                </>
              )}
              </div>
              
            )}
          
          <div className="flex gap-2">
            <div className="px-3 py-1 grow shrink rounded-[5px] border border-[#babcc3]/60 justify-start items-center gap-2.5 inline-flex ">
              <div className="rounded-[100px] bg-slate-200 h-[20px] w-[20px] flex justify-center items-center">
                <Image
                  src={`/brick.webp`}
                  alt={`BRC`}
                  height={20}
                  width={20}
                  className="h-[20px] w-[20px] object-scale-down"
                />
              </div>
              <div className="text-sm font-bold">Seabrick NFT</div>
            </div>
            <form action={claimNFT}>
              <input name="tokenNumber" type="hidden" />
              <SubmitButton
                buttonIcon={
                  <CurrencyDollarIcon className="size-[1.5rem] inline mr-[-3px] " />
                }
                buttonClass="bg-[#2069a0] hover:bg-[#17548b] active:bg-[#4290d6] rounded-[5px] p-2.5 text-white text-sm"
                label="Claim Available Tokens"
                disable={disabledClaim}
              />
            </form>
          </div>
        </ClaimModal>
      )}
    </>
  )
}
