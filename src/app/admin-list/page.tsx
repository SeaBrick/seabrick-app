"use client"
import AdminTable from "@/components/table/AdminTable"
import { useState, useEffect } from "react"
import { addAdmin, AdminInterface, getAdmins, removeAdmin } from "./requests"

const App: React.FC = () => {
  const [adminList, setAdminList] = useState<AdminInterface[]>([])
  useEffect(() => {
    fetchData()
  }, [adminList])
  const fetchData = async () => {
    const result = await getAdmins()
    setAdminList(result.data)
  }
  async function handleDeletion(id: string) {
    await removeAdmin(id)
    await fetchData()
  }
  async function handleAddition(email: string) {
    await addAdmin(email)
    await fetchData()
  }
  return (
    <div>
      <div className="flex flex-col items-center justify-center mb-10 mt-8">
        <span className="text-center text-[#666666] text-[17px] font-normal font-['Noto Sans']">
          Account
        </span>
        <h1 className="text-center text-black text-4xl font-normal">Admins</h1>
      </div>
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
    </div>
  )
}

export default App
