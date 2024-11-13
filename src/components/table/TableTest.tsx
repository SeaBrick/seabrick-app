export interface TableColumn {
  key: string
  label: string
}
import { processTime, timeAgo } from "@/lib/utils"
import TextCopier from "../TextCopier"
export function truncateString(str: string) {
  if (str.length <= 13) {
    return str
  }
  const firsts = str.slice(0, 5)
  const lasts = str.slice(-5)
  return firsts + "..." + lasts
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Table({
  columns,
  data,
  textExtraClasses = "",
}: {
  columns: TableColumn[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { [s: string]: any }[]
  textExtraClasses?: string
}) {
  return (
    <div className="overflow-auto w-full rounded-t-[10px]">
      <table className=" bg-white gap-2.5 table-fixed min-w-full">
        <thead className="w-full bg-[#efeff4] gap-5">
          <tr className="w-full table-row">
            {columns.map((column) => (
              <th
                className={`text-black w-[auto] text-justify text-[0.75rem]  font-normal font-['Noto Sans'] table-cell p-3 ${textExtraClasses}`}
                key={column.key}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="w-full px-6 pt-[14px] gap-4 min-w-fit">
          {data.map((row, j) => (
            <tr
              className="table-row w-full border-b-[1px] border-[#efeff4]"
              key={j}
            >
              {columns.map((column, i) => {
                let enableCopier = false
                let valueText = ""
                let showText = row[column.key]
                if (row[column.key] && row[column.key].length > 13) {
                  enableCopier = true
                  valueText = row[column.key]
                  showText = truncateString(row[column.key])
                }
                if (column.key === "claimed") {
                  showText =
                    row[column.key] === false ? "Not Claimed" : "Claimed"
                }
                if (column.key === "blockTimestamp") {
                  showText = timeAgo(processTime(row[column.key]))
                }
                return (
                  <td
                    className={`text-black text-justify text-[0.75rem] font-normal font-['Noto_Sans'] table-cell p-3 inline-flex ${textExtraClasses} test`}
                    key={`${j}-${i}`}
                  >
                    <div className="flex">
                      <p>{showText}</p>
                      {enableCopier ? <TextCopier text={valueText} /> : ""}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
