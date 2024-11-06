interface TableColumn {
  key: string
  label: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Table({ columns, data }: { columns: TableColumn[]; data: any[] }) {
  return (
    <div className="overflow-auto w-full">
      <table className="w-full min-w-fit bg-white rounded-[10px] flex-col justify-start items-start gap-2.5 flex mt-[20px] table-fixed">
        <thead className="w-full h-auto px-6 py-4 bg-[#efeff4] flex-col justify-start items-start gap-5 flex rounded-t-[10px]">
          <tr className="items-center inline-flex w-full">
            {columns.map((column) => (
              <th
                className="text-black w-full text-justify text-xs font-normal font-['Noto Sans']"
                key={column.key}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="w-full px-6 pt-[17px] flex-col justify-start items-end gap-4 flex min-w-fit">
          {data.map((row) => (
            <tr className="w-full items-start inline-flex" key={row.id}>
              {columns.map((column) => (
                <td
                  className="text-black w-full text-justify text-xs font-normal font-['Noto Sans']"
                  key={column.key}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
