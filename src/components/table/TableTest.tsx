export interface TableColumn {
  key: string
  label: string
}
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
  fontSize = "0.75rem",
}: {
  columns: TableColumn[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { [s: string]: any }[]
  fontSize?: string
}) {
  return (
    <div className="overflow-auto w-full rounded-t-[10px]">
      <table className="w-full min-w-[450px] bg-white gap-2.5 table-fixed">
        <thead className="w-full bg-[#efeff4] gap-5">
          <tr className="w-full table-row">
            {columns.map((column) => (
              <th
                className={`text-black w-full text-justify text-[${fontSize}]  font-normal font-['Noto Sans'] table-cell p-3`}
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
              className="w-full table-row border-b-[1px] border-[#efeff4]"
              key={j}
            >
              {columns.map((column, i) => {
                let enableCopier = false
                let valueText = ""
                let showText = row[column.key]
                if (
                  column.key === "hash" ||
                  column.key == "address" ||
                  column.key === "from_address" ||
                  column.key == "to_address"
                ) {
                  enableCopier = true
                  valueText = row[column.key]
                  console.log("After", row[column.key])
                  showText = truncateString(row[column.key])
                  console.log("Before", row[column.key], valueText)
                }
                return (
                  <td
                    className={`text-black w-full text-justify text-[${fontSize}] font-normal font-['Noto Sans'] table-cell p-3 inline-flex`}
                    key={`${j}-${i}`}
                  >
                    <div className="inline-flex">
                      {showText}
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
