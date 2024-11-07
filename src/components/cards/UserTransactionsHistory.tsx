import { truncateString } from "../table/TableTest"
import TextCopier from "../TextCopier"

export interface UserTransactionHistoryData {
  total: number
  type: "claimed" | "minted"
  hash: string
  amount: number
  token?: string
}
export default function UserTransactionHistory({
  data,
}: {
  data: UserTransactionHistoryData[]
}) {
  return (
    <>
      {data.map((d, i) => {
        return (
          <div
            className="self-stretch flex-col justify-start items-start gap-2 flex"
            key={i}
          >
            <div className="self-stretch h-15 px-4 py-3 bg-[#efeff4] rounded-[10px] flex-col justify-start items-start gap-2.5 flex">
              <div className="self-stretch justify-center items-center gap-3 inline-flex">
                <div className="grow shrink basis-0 h-[39px] justify-start items-center gap-4 flex">
                  <div className="flex-col justify-start items-start gap-px inline-flex">
                    <div className="text-[#333333] text-[0.8rem] font-bold font-['Noto Sans']">
                      {d.type === "claimed" ? `Claimed` : `Minted`} Tokens
                    </div>
                    <div className="text-[#333333] text-[0.65rem] font-normal font-['Noto Sans']">
                      {d.type === "claimed"
                        ? `${d.amount} ${d.token}`
                        : `X${d.amount}`}
                    </div>
                  </div>
                  <div className="grow shrink basis-0 flex-col justify-start items-end gap-px inline-flex">
                    <div className="self-stretch text-right text-[#00b158] text-[0.7rem] font-normal font-['Noto Sans']">
                      ${d.amount}
                    </div>
                    <div className="self-stretch justify-end items-start gap-1.5 inline-flex">
                      <div className="text-right text-[#333333] text-[0.65rem] font-normal font-['Noto Sans'] inline-flex items-center">
                        to {truncateString(d.hash)} <TextCopier text={d.hash} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
