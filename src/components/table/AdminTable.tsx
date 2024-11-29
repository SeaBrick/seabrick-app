"use client";
import { useState } from "react";
import ModalAdd from "@/components/modals/Modal-add";
import Modal from "@/components/modals/Modal";
import { TrashIcon } from "@heroicons/react/24/outline";
import TextCopier from "../TextCopier";
import ModalDelete from "../modals/Modal";
import Container from "../utils/Container";
import SubmitButton from "../buttons/SubmitButton";
import { AdminInterface } from "@/app/admin-list/requests";
import { truncateString } from "@/lib/utils";
import Image from "next/image";

interface TableColumn {
  key: string;
  label: string;
}

function AdminTable({
  columns,
  data,
  deleteAdmin,
  addAdmin,
}: {
  columns: TableColumn[];
  data: AdminInterface[];
  deleteAdmin: (id: string) => void;
  addAdmin: (email: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const [addAdminOpen, setAddAdminOpen] = useState(false);

  //

  return (
    <div className="w-full max-w-[978px] p-6 bg-white rounded-[10px] flex-col justify-start items-center gap-4 flex mx-auto">
      <div className="flex justify-between items-center w-full">
        <h3 className="text-[#49414d] text-xl font-bold">Admin List</h3>
        <div className="justify-start items-center gap-2 flex">
          <button
            className="text-white text-xs font-normal font-['Noto Sans'] p-[17px] bg-dark-gray hover:bg-dark-gray/90 hover:bg-[#222] rounded-[5px]"
            onClick={() => setAddAdminOpen(true)}
          >
            Add Admins
          </button>
          <Modal open={addAdminOpen} setOpen={setAddAdminOpen}>
            <ModalAdd
              open={addAdminOpen}
              setOpen={setAddAdminOpen}
              addNewAdmin={addAdmin}
            />
          </Modal>
        </div>
      </div>
      {data.length > 0 ? (
        <>
          <table className="flex-col justify-start items-start gap-4 flex w-full overflow-x-auto">
            <thead className="w-full ">
              <tr className=" h-12 px-6 py-4 bg-[#efeff4] items-start gap-5 flex">
                {columns.map((column) => (
                  <th
                    className="text-dark-gray max-w-[173px] lg:max-w-[243px] w-full text-xs font-normal font-['Noto Sans'] text-start"
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
                    let enableCopier = false;
                    let valueText = "";
                    let showText = row[column.key as keyof AdminInterface];
                    if (column.key == "address" && row[column.key]) {
                      enableCopier = true;
                      valueText = row[column.key]!;
                      showText = truncateString(row[column.key]!);
                    }
                    if (column.key === "created_at") {
                      showText = new Date(row[column.key]).toLocaleDateString();
                    }
                    return (
                      <td
                        className="text-dark-gray w-full text-justify text-xs font-normal font-['Noto Sans'] inline-flex"
                        key={column.key}
                      >
                        <div className="inline-flex items-center">
                          <span>{showText ?? "No data"}</span>
                          {enableCopier ? <TextCopier text={valueText} /> : ""}
                        </div>
                      </td>
                    );
                  })}
                  <td>
                    <button
                      className="text-dark-gray text-xs font-normal font-['Noto Sans'] h-[30px] px-4 py-[17px] bg-dark-gray rounded-[5px] justify-start items-center flex gap-1.5 hover:bg-dark-gray/90"
                      onClick={() => {
                        setOpen(true);
                      }}
                    >
                      <TrashIcon className="h-4 w-4 text-white" />
                      <span className="text-white text-xs font-normal font-['Noto Sans']">
                        Delete
                      </span>
                    </button>
                    <ModalDelete open={open} setOpen={setOpen}>
                      <Container>
                        <div className="flex flex-col items-start gap-y-4 w-[40rem] p-6">
                          <h3 className="text-dark-gray text-4xl ">Delete</h3>
                          <p className="text-[#8A8A8F] text-sm">
                            Are you sure you want to delete this Admin?
                          </p>
                          <div className="flex justify-end gap-4 w-full mt-4">
                            <button
                              onClick={() => setOpen(false)}
                              className="text-dark-gray text-sm p-[17px] bg-[#efeff4] hover:bg-[#ccccd1] rounded-[5px]"
                            >
                              Cancel
                            </button>
                            <SubmitButton
                              label="Delete"
                              loadingLabel="Deleting..."
                              buttonClass="text-white text-sm p-[17px] bg-dark-gray hover:bg-dark-gray/90 rounded-[5px] max-w-fit"
                              onClick={async () => {
                                await deleteAdmin(row.user_id);
                                setOpen(false);
                              }}
                            />
                          </div>
                        </div>
                      </Container>
                    </ModalDelete>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="w-full h-full flex flex-col justify-center text-center gap-1">
          <Image
            src={`/empty-folder.webp`}
            alt="user-image"
            height={120}
            width={120}
            className="rounded-[100px] m-auto"
          />
          <strong>No Admins yet </strong>
        </div>
      )}
    </div>
  );
}

export default AdminTable;
