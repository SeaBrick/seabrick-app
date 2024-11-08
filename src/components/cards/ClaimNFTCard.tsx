"use client"
import { useState } from "react"
import Modal from "../modals/Modal"
import ClaimNFT from "./ClaimNFT"

export default function ClaimNFTCard() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showClaimModal, setShowClaimModal] = useState(false)
  const handleOpenModalClaim = (open: boolean) => {
    setShowClaimModal(open)
  }
  return (
    <>
      <Modal open={showClaimModal} setOpen={setShowClaimModal}>
        <ClaimNFT open={showClaimModal} setOpen={setShowClaimModal} />
      </Modal>
      <div className="h-full w-full p-3 bg-gradient-to-b from-[#52b09f] to-[#005391] rounded-[10px] flex-col justify-between items-start inline-flex overflow-hidden">
        <div className="h-[] flex-col justify-start items-start gap-2 flex mb-[5px]">
          <div className="self-stretch text-white text-base font-bold font-['Noto Sans']">
            Influence the user to buy, claim, send, etc!
          </div>
          <div className="self-stretch text-white text-sm font-normal font-['Noto Sans']">
            Claim your NFTs!
          </div>
        </div>
        <div className="h-[] relative ml-48">
          <div className="w-[113.23px] h-[113.23px] left-[80.06px] top-[0] absolute origin-top-left rotate-45 opacity-50 rounded-full border-2 border-white"></div>
          <div className="w-[71.02px] h-[71.02px] left-[45.51px] top-[75.02px] absolute origin-top-left rotate-[-120deg] opacity-50 rounded-full border-2 border-white"></div>
        </div>
        <button
          className="h-[50px] p-[17px] bg-white rounded-[5px] justify-start items-center gap-2.5 inline-flex hover:bg-slate-50 active:bg-slate-200"
          onClick={() => handleOpenModalClaim(true)}
        >
          <div className="text-right text-black text-sm font-normal font-['Noto Sans']">
            Claim your NFTs
          </div>
        </button>
      </div>
    </>
  )
}
