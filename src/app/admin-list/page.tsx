"use client"
import AdminTable from "@/components/table/AdminTable"
import { useState, useEffect } from "react"
import { addAdmin, AdminInterface, getAdmins, removeAdmin } from "./requests"
import BackButton from "@/components/buttons/BackButton"
import Image from "next/image"

const App: React.FC = () => {
  const [adminList, setAdminList] = useState<AdminInterface[]>([])

  //
  useEffect(() => {
    fetchData()
  }, [])
  //
  const fetchData = async () => {
    const result = await getAdmins()
    setAdminList(result.data)
  }
  //
  async function handleDeletion(id: string) {
    await removeAdmin(id)
    await fetchData()
  }
  async function handleAddition(email: string) {
    await addAdmin(email)
    await fetchData()
  }
  return (
    <div className="max-w-[978px] w-full mx-auto mt-[30px] relative">
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>
      <div className="flex flex-col items-center justify-center mb-10 mt-8 relative">
        <span className="text-center text-[#666666] text-[17px] font-normal font-['Noto Sans']">
          Account
        </span>
        <h1 className="text-center text-black text-4xl font-normal">Admins</h1>
      </div>
      {adminList.length > 0 ? (
      <AdminTable
        columns={[
          { key: "email", label: "Email" },
          { key: "address", label: "Address" },
          { key: "created_at", label: "Added Date" },
        ]}
        data={adminList}
        deleteAdmin={handleDeletion}
        addAdmin={handleAddition}
      />
      ):(
        <div className="w-full h-full flex flex-col justify-center text-center gap-1">
          <Image
            src={`/empty-folder.webp`}
            alt="user-image"
            height={120}
            width={120}
            className="rounded-[100px] m-auto"
          />
          <strong>No Admins yet :c</strong>          
        </div>
      )}
    </div>
  )
}

export default App
