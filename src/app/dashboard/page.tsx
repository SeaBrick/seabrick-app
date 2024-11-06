import Image from "next/image"
export default function Dashboard() {
  return (
    <>
      <div className="w-full justify-start items-center gap-4 inline-flex">
        <Image
          className="p-[9.17px] rounded-[142.08px]"
          height={71}
          width={71}
          src={`/brick.png`}
          alt={"user-profile"}
        />
        <div className="h-[70px] flex-col justify-start items-start gap-px inline-flex">
          <div className="self-stretch text-[#666666] text-[17px] font-normal font-['Noto Sans']">
            Welcome Back!
          </div>
          <div className="text-black text-4xl font-normal font-['Noto Sans']">
            Sebastian Rojas
          </div>
        </div>
      </div>
    </>
  )
}
