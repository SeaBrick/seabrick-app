import Link from "next/link";
interface CheckEmailProps {
  email: string;
  text?: string;
}

const CheckEmail: React.FC<CheckEmailProps> = ({ email, text }) => {
  return (
    <div className="w-[606px] h-fit p-6 bg-white rounded-[10px] flex-col justify-start items-center gap-8 inline-flex z-10 mt-[180px]">
      <div className="self-stretch h-fit flex-col justify-start items-center gap-4 flex">
        <div className="h-[74px] flex-col justify-center items-center gap-[5px] flex">
          <div className="text-dark-gray text-[15px] font-normal font-['Noto Sans']">
            Account
          </div>
          <div className="text-dark-gray text-4xl font-normal font-['Noto Sans']">
            Check your email!
          </div>
        </div>
        {text && (
          <div className="self-stretch text-[#8a8a8f] text-sm font-normal font-['Noto Sans']">
            {text}
          </div>
        )}

        {!text && (
          <div className="self-stretch text-[#8a8a8f] text-sm font-normal font-['Noto Sans']">
            You can go to your email. Remember to check your spam folder
          </div>
        )}
      </div>
      <div className="self-stretch h-24 flex-col justify-start items-start gap-4 flex">
        <div className="self-stretch h-[19px] flex-col justify-center items-start gap-2 flex">
          <div>
            <span className="text-dark-gray text-sm font-normal font-['Noto Sans']">
              Email sent to{" "}
            </span>
            <span className="text-dark-gray text-sm font-bold font-['Noto Sans']">
              {email}
            </span>
          </div>
        </div>
        <div className="self-stretch h-[45px] flex-col justify-start items-center gap-4 flex mt-2">
          <div className="">
            <Link
              href="/login"
              prefetch={true}
              className="grow py-3 px-16 shrink basis-0 self-stretch bg-seabrick-blue rounded-[5px] justify-center items-center gap-2.5 hover:bg-seabrick-blue/80 disabled:cursor-not-allowed disabled:bg-gray-400 text-center text-white text-sm font-normal font-['Noto Sans']"
            >
              Ok
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
