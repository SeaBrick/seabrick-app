import AdminTable from "@/components/table/AdminTable";



const App: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center mb-10 mt-8">
        <span className="text-center text-[#666666] text-[17px] font-normal font-['Noto Sans']">Account</span>
        <h1 className="text-center text-black text-4xl font-normal">Admins</h1>
      </div>

      <AdminTable columns={[
            { key: "email", label: "Email" },
            { key: "address", label: "Address" },
            { key: "date", label: "Added Date" },
          ]}
          data={[
            {
              "id": 1,
              "email": "admin1@example.com",
              "address": "0x06383...ee629cfb",
              "date": "10/08/24 00:23:15"
            },
            {
              "id": 2,
              "email": "admin2@example.com",
              "address": "0x06383...ee629cfb",
              "date": "10/08/24 00:23:15"
            },
            {
              "id": 3,
              "email": "admin3@example.com",
              "address": "0x06383...ee629cfb",
              "date": "10/08/24 00:23:15"
            }
          ]}
          />
    </div>
  );
};

export default App;
