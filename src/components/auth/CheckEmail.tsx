import Link from "next/link";
interface CheckEmailProps {
  email: string;
  text?: string;
}

const CheckEmail: React.FC<CheckEmailProps> = ({ email, text }) => {
  return (
    <div className="w-[606px] h-[399px] p-6 bg-white rounded-[10px] flex-col justify-start items-center gap-8 inline-flex z-10 mt-[180px]">
      <div className="self-stretch h-[223px] flex-col justify-start items-center gap-4 flex">
        <div className="h-[74px] flex-col justify-center items-center gap-[5px] flex">
          <div className="text-[#333333] text-[15px] font-normal font-['Noto Sans']">
            Account
          </div>
          <div className="text-[#333333] text-4xl font-normal font-['Noto Sans']">
            Check your email!
          </div>
        </div>
        {text && (
          <div className="self-stretch text-[#8a8a8f] text-sm font-normal font-['Noto Sans']">
            {text}
          </div>
        )}

        {/* TODO: Remove this. ONly for dev */}
        {!text && (
          <div className="self-stretch text-[#8a8a8f] text-sm font-normal font-['Noto Sans']">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industrys standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </div>
        )}
      </div>
      <div className="self-stretch h-24 flex-col justify-start items-start gap-4 flex">
        <div className="self-stretch h-[19px] flex-col justify-center items-start gap-2 flex">
          <div>
            <span className="text-[#333333] text-sm font-normal font-['Noto Sans']">
              Email sent to{" "}
            </span>
            <span className="text-[#333333] text-sm font-bold font-['Noto Sans']">
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
