import { Aggregator, ERC20Token } from "@/lib/interfaces";
import ImageFallback from "../images/ImageFallback";
import { useReadContract } from "wagmi";
import { ierc20Abi } from "@/lib/contracts/abis";
import { type Address, formatUnits } from "viem";

interface SelecTokenButtonProps {
  setSelect: () => void;
  isSelected: boolean;
  token: ERC20Token;
  aggregator: Aggregator;
  walletAddress: Address;
}
const SelecTokenButton: React.FC<SelecTokenButtonProps> = ({
  token,
  setSelect,
  isSelected,
  walletAddress,
}) => {
  const { data: balance } = useReadContract({
    abi: ierc20Abi,
    address: token.address,
    functionName: "balanceOf",
    args: [walletAddress],
  });

  return (
    <div className="grow shrink basis-0 justify-end items-end gap-4 flex">
      <div className="grow shrink basis-0 self-stretch flex-col justify-center items-start gap-2 inline-flex">
        <button
          onClick={setSelect}
          type="button"
          className={`self-stretch grow shrink basis-0 px-[15px] py-2.5 rounded-[5px] border border-[#babcc3]/60 justify-start items-center gap-2.5 inline-flex hover:bg-[#2069a0] hover:text-white ${isSelected && "bg-[#2069a0] text-white"}`}
        >
          <div className="w-[25px] h-[25px] relative">
            <div className="w-[22.22px] left-[1.40px] top-[1.39px] absolute">
              <ImageFallback
                width={25}
                height={25}
                className="w-[25px] h-[25px] object-cover"
                //  src="/tokens/ETH-R.webp"
                src={`/tokens/${token.symbol}.webp`}
                fallbackSrc="/tokens/empty-token.svg"
                alt="Token"
              />
            </div>
          </div>
          <div className="text-current text-sm font-normal font-['Noto Sans'] flex gap-x-2">
            {isSelected && (
              <span>
                {parseFloat(
                  formatUnits(
                    BigInt(balance?.toString() || "0"),
                    parseInt(token.decimals)
                  )
                ).toFixed(2)}
              </span>
            )}
            <span className={`${isSelected && "font-bold"}`}>
              {token.symbol}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SelecTokenButton;
