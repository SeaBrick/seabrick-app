
"use client";
import Modal from "@/components/modals/Modal-add";
import { TrashIcon } from "@heroicons/react/24/outline";
import TextCopier from "../TextCopier"



interface TableColumn {
  key: string
  label: string
}
function truncateString(str: string) {
  if (str.length <= 13) {
    return str
  }
  const firsts = str.slice(0, 5)
  const lasts = str.slice(-5)
  return firsts + "..." + lasts
}

function AdminTable ({ columns, data }: { columns: TableColumn[]; data: any[] }) {

  return (
    <div className="w-full max-w-[978px] p-6 bg-white rounded-[10px] flex-col justify-start items-center gap-4 flex mx-auto">
      <div className="flex justify-between items-center w-full">
        <h3 className="text-[#49414d] text-xl font-bold">Admin List</h3>
        <Modal />
      </div>
      <table className="flex-col justify-start items-start gap-4 flex w-full overflow-x-auto">
        <thead className='w-full '>
          <tr className=" h-12 px-6 py-4 bg-[#efeff4] items-start gap-5 flex">
            {columns.map((column) => (
              <th
                className="text-[#333333] max-w-[173px] lg:max-w-[243px] w-full text-xs font-normal font-['Noto Sans'] text-start"
                key={column.key}
              >
                {column.label}
              </th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody className='w-full'>
          {data.map((row) => 
          (            
            <tr key={row.id} className="flex justify-between px-6 h-12 gap-5 items-center">
              {columns.map((column) => {
                let enableCopier = false
                let valueText = ""
                if (column.key === "email" || column.key == "address") {
                  enableCopier = true
                  valueText = row[column.key]
                  row[column.key] = truncateString(row[column.key])
                }
                return (
                  <td
                    className="text-[#333] w-full text-justify text-xs font-normal font-['Noto Sans'] inline-flex"
                    key={column.key}
                  >
                    <div className="inline-flex">
                      {row[column.key]}
                      {enableCopier ? <TextCopier text={valueText} /> : ""}
                    </div>
                  </td>
                )
                
              })}
              <td >
                <button className="text-[#333] text-xs font-normal font-['Noto Sans'] h-[30px] px-4 py-[17px] bg-[#333333] rounded-[5px] justify-start items-center flex gap-1.5">
                  <TrashIcon className="h-4 w-4 text-white"/>
                  <span className="text-white text-xs font-normal font-['Noto Sans']">Delete</span>
                </button>
              </td>
            </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;