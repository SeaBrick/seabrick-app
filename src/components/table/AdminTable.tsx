"use client"
import { useState } from "react"
import Modal from "@/components/modals/Modal-add"
import { TrashIcon } from "@heroicons/react/24/outline"
import TextCopier from "../TextCopier"
import ModalDelete from "../modals/Modal"
import Container from "../utils/Container"
import SubmitButton from "../buttons/SubmitButton"
import { AdminInterface } from "@/app/admin-list/requests"

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

function AdminTable({
  columns,
  data,
  deleteAdmin,
  addAdmin,
}: {
  columns: TableColumn[]
  data: AdminInterface[]
  deleteAdmin: (id: string) => void
  addAdmin: (email: string) => void
}) {
  const [open, setOpen] = useState(false)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setOpen(false)
  }
  //

  //

  return (
    <div className="w-full max-w-[978px] p-6 bg-white rounded-[10px] flex-col justify-start items-center gap-4 flex mx-auto">
      <div className="flex justify-between items-center w-full">
        <h3 className="text-[#49414d] text-xl font-bold">Admin List</h3>
        <Modal action={addAdmin} />
      </div>
      <table className="flex-col justify-start items-start gap-4 flex w-full overflow-x-auto">
        <thead className="w-full ">
          <tr className=" h-12 px-6 py-4 bg-[#efeff4] items-start gap-5 flex">
            {columns.map((column) => (
              <th
                className="text-text-gray max-w-[173px] lg:max-w-[243px] w-full text-xs font-normal font-['Noto Sans'] text-start"
                key={column.key}
              >
                {column.label}
              </th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody className="w-full">
          {data.map((row) => (
            <tr
              key={row.user_id}
              className="flex justify-between px-6 h-12 gap-5 items-center"
            >
              {columns.map((column) => {
                let enableCopier = false
                let valueText = ""
                if (
                  (column.key === "email" || column.key == "address") &&
                  row[column.key]
                ) {
                  enableCopier = true
                  valueText = row[column.key]!
                  row[column.key] = truncateString(row[column.key]!)
                }
                if (column.key === "created_at") {
                  row[column.key] = new Date(
                    row[column.key]
                  ).toLocaleDateString()
                }
                return (
                  <td
                    className="text-[#333] w-full text-justify text-xs font-normal font-['Noto Sans'] inline-flex"
                    key={column.key}
                  >
                    <div className="inline-flex">
                      {row[column.key as keyof AdminInterface] ?? "No data"}
                      {enableCopier ? <TextCopier text={valueText} /> : ""}
                    </div>
                  </td>
                )
              })}
              <td>
                <button
                  className="text-[#333] text-xs font-normal font-['Noto Sans'] h-[30px] px-4 py-[17px] bg-text-gray rounded-[5px] justify-start items-center flex gap-1.5 hover:bg-text-gray/90"
                  onClick={() => deleteAdmin(row.user_id)}
                >
                  <TrashIcon className="h-4 w-4 text-white" />
                  <span className="text-white text-xs font-normal font-['Noto Sans']">
                    Delete
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalDelete open={open} setOpen={setOpen}>
        <Container>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-start gap-y-4 w-[40rem] p-6"
          >
            <h3 className="text-text-gray text-4xl ">Delete</h3>
            <p className="text-[#8A8A8F] text-sm">
              Are you sure you want to delete this Admin?
            </p>
            <div className="flex justify-end gap-4 w-full mt-4">
              <button
                onClick={() => setOpen(false)}
                className="text-text-gray text-sm p-[17px] bg-[#efeff4] hover:bg-[#ccccd1] rounded-[5px]"
              >
                Cancel
              </button>
              <SubmitButton
                label="Delete"
                loadingLabel="Login..."
                buttonClass="text-white text-sm p-[17px] bg-text-gray hover:bg-text-gray/90 rounded-[5px] max-w-fit"
              />
            </div>
          </form>
        </Container>
      </ModalDelete>
    </div>
  )
}

export default AdminTable
