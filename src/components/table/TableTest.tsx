interface TableColumn {
  key: string
  label: string
}

function truncateString(str: string) {
  // Si la cadena tiene menos de 5 caracteres, retorna la cadena completa
  if (str.length <= 13) {
    return str
  }

  // Toma los primeros 5 caracteres y los últimos
  const firsts = str.slice(0, 5)
  const lasts = str.slice(-5)

  // Combina los primeros 5, los puntos suspensivos y los últimos
  return firsts + "..." + lasts
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Table({ columns, data }: { columns: TableColumn[]; data: any[] }) {
  return (
    <div className="overflow-auto w-full mt-4 rounded-t-[10px]">
      <table className="w-full min-w-[500px] bg-white gap-2.5 table-fixed">
        <thead className="w-full bg-[#efeff4] gap-5">
          <tr className="w-full table-row">
            {columns.map((column) => (
              <th
                className="text-black w-full text-justify text-xs font-normal font-['Noto Sans'] table-cell p-4"
                key={column.key}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="w-full px-6 pt-[17px] gap-4 min-w-fit">
          {data.map((row) => (
            <tr
              className="w-full table-row border-b-[1px] border-[#efeff4]"
              key={row.id}
            >
              {columns.map((column) => {
                if (column.key === "hash" || column.key == "address") {
                  row[column.key] = truncateString(row[column.key])
                  console.log(row[column.key])
                }
                return (
                  <td
                    className="text-black w-full text-justify text-xs font-normal font-['Noto Sans'] table-cell p-4"
                    key={column.key}
                  >
                    {row[column.key]}
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
