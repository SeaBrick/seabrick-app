import Image from "next/image";
import React from "react";
import SubmitButton from "../buttons/SubmitButton";

const BuyNFTCrypto: React.FC = () => {
  return (
    <form className="mt-[180px]">
      <div className="w-[580px] h-[651px] p-6 bg-white rounded-[10px] justify-start items-center gap-2.5 inline-flex">
        <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-[30px] inline-flex">
          <div className="self-stretch h-[65px] flex-col justify-start items-start gap-6 flex">
            <div className="self-stretch justify-start items-center gap-4 inline-flex">
              <Image
                width={65}
                height={62}
                className="w-[65px] h-[62px]"
                src="/brick.webp"
                alt="token"
              />
              <div className="w-[332px] h-[65px] flex-col justify-between items-start inline-flex">
                <div className="w-[254px] justify-start items-center gap-2.5 inline-flex">
                  <div className="text-[#8a8a8f] text-[15px] font-normal font-['Noto Sans']">
                    Seabrick NFT
                  </div>
                </div>
                <div className="self-stretch justify-start items-end gap-2.5 inline-flex">
                  <div className="w-full h-[33px] text-[#323232] text-4xl font-normal font-['Noto Sans']">
                    100,00 US$
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="justify-start items-start gap-[30px] inline-flex">
            <div className="pb-1.5 border-b-2 justify-start items-start gap-2.5 flex">
              <div className="text-[#8a8a8f] text-xl font-bold font-['Noto Sans'] leading-normal">
                Credit/Debit Card
              </div>
            </div>
            <div className="justify-start items-start gap-8 flex">
              <div className="justify-center items-center gap-2.5 flex">
                <div className="pb-1.5 border-b-2 border-black justify-center items-center gap-2.5 flex">
                  <div className="text-[#49414d] text-xl font-bold font-['Noto Sans'] leading-normal">
                    Crypto
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch h-[206px] flex-col justify-start items-start gap-5 flex">
            <div className="text-black text-sm font-normal font-['Noto Sans']">
              Select Token
            </div>
            <div className="self-stretch h-[167px] flex-col justify-start items-start gap-4 flex">
              <div className="self-stretch h-[167px] flex-col justify-start items-start gap-4 flex">
                <div className="self-stretch h-[45px] justify-start items-start gap-4 inline-flex">
                  <div className="grow shrink basis-0 self-stretch flex-col justify-center items-start gap-2 inline-flex">
                    <button
                      type="button"
                      className="self-stretch grow shrink basis-0 px-[15px] py-2.5 rounded-[5px] border border-[#babcc3]/60 justify-start items-center gap-2.5 inline-flex hover:bg-[#2069a0] hover:text-white active:bg-[#2069a0] active:text-white"
                    >
                      <div className="w-[25px] h-[25px] relative">
                        <div className="w-[22.22px] h-[22.22px] left-[1.40px] top-[1.39px] absolute">
                          <Image
                            width={25}
                            height={25}
                            className="w-[25px] h-[25px]"
                            src="/tokens/eth-r.png"
                            alt="token"
                          />
                        </div>
                      </div>
                      <div className="text-current text-sm font-normal font-['Noto Sans']">
                        ETH
                      </div>
                    </button>
                  </div>
                  <div className="grow shrink basis-0 h-[45px] justify-end items-end gap-4 flex">
                    <div className="grow shrink basis-0 self-stretch flex-col justify-center items-start gap-2 inline-flex">
                      <button
                        type="button"
                        className="self-stretch grow shrink basis-0 px-[15px] py-2.5 rounded-[5px] border border-[#babcc3]/60 justify-start items-center gap-2.5 inline-flex hover:bg-[#2069a0] hover:text-white active:bg-[#2069a0] active:text-white"
                      >
                        <div className="w-[25px] h-[25px] relative">
                          <div className="w-[22.22px] h-[22.22px] left-[1.40px] top-[1.39px] absolute">
                            <Image
                              width={25}
                              height={25}
                              className="w-[25px] h-[25px]"
                              src="/tokens/sol-r.png"
                              alt="token"
                            />
                          </div>
                        </div>
                        <div className="text-current text-sm font-normal font-['Noto Sans']">
                          SOL
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-[45px] justify-start items-start gap-4 inline-flex">
                  <div className="grow shrink basis-0 self-stretch flex-col justify-center items-start gap-2 inline-flex">
                    <button
                      type="button"
                      className="self-stretch grow shrink basis-0 px-[15px] py-2.5 rounded-[5px] border border-[#babcc3]/60 justify-start items-center gap-2.5 inline-flex hover:bg-[#2069a0] hover:text-white active:bg-[#2069a0] active:text-white"
                    >
                      <div className="w-[25px] h-[25px] relative">
                        <div className="w-[22.22px] h-[22.22px] left-[1.40px] top-[1.39px] absolute">
                          <Image
                            width={25}
                            height={25}
                            className="w-[25px] h-[25px]"
                            src="/tokens/eth-r.png"
                            alt="token"
                          />
                        </div>
                      </div>
                      <div className="text-current text-sm font-normal font-['Noto Sans']">
                        ETH
                      </div>
                    </button>
                  </div>
                  <div className="grow shrink basis-0 h-[45px] justify-end items-end gap-4 flex">
                    <div className="grow shrink basis-0 self-stretch flex-col justify-center items-start gap-2 inline-flex">
                      <button
                        type="button"
                        className="self-stretch grow shrink basis-0 px-[15px] py-2.5 rounded-[5px] border border-[#babcc3]/60 justify-start items-center gap-2.5 inline-flex hover:bg-[#2069a0] hover:text-white active:bg-[#2069a0] active:text-white"
                      >
                        <div className="w-[25px] h-[25px] relative">
                          <div className="w-[22.22px] h-[22.22px] left-[1.40px] top-[1.39px] absolute">
                            <Image
                              width={25}
                              height={25}
                              className="w-[25px] h-[25px]"
                              src="/tokens/sol-r.png"
                              alt="token"
                            />
                          </div>
                        </div>
                        <div className="text-current text-sm font-normal font-['Noto Sans']">
                          SOL
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-[45px] justify-start items-start gap-4 inline-flex">
                  <div className="grow shrink basis-0 self-stretch flex-col justify-center items-start gap-2 inline-flex">
                    <button
                      type="button"
                      className="self-stretch grow shrink basis-0 px-[15px] py-2.5 rounded-[5px] border border-[#babcc3]/60 justify-start items-center gap-2.5 inline-flex hover:bg-[#2069a0] hover:text-white active:bg-[#2069a0] active:text-white"
                    >
                      <div className="w-[25px] h-[25px] relative">
                        <div className="w-[22.22px] h-[22.22px] left-[1.40px] top-[1.39px] absolute">
                          <Image
                            width={25}
                            height={25}
                            className="w-[25px] h-[25px]"
                            src="/tokens/eth-r.png"
                            alt="token"
                          />
                        </div>
                      </div>
                      <div className="text-current text-sm font-normal font-['Noto Sans']">
                        ETH
                      </div>
                    </button>
                  </div>
                  <div className="grow shrink basis-0 h-[45px] justify-end items-end gap-4 flex">
                    <div className="grow shrink basis-0 self-stretch flex-col justify-center items-start gap-2 inline-flex">
                      <button
                        type="button"
                        className="self-stretch grow shrink basis-0 px-[15px] py-2.5 rounded-[5px] border border-[#babcc3]/60 justify-start items-center gap-2.5 inline-flex hover:bg-[#2069a0] hover:text-white active:bg-[#2069a0] active:text-white"
                      >
                        <div className="w-[25px] h-[25px] relative">
                          <div className="w-[22.22px] h-[22.22px] left-[1.40px] top-[1.39px] absolute">
                            <Image
                              width={25}
                              height={25}
                              className="w-[25px] h-[25px]"
                              src="/tokens/sol-r.png"
                              alt="token"
                            />
                          </div>
                        </div>
                        <div className="text-current text-sm font-normal font-['Noto Sans']">
                          SOL
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[212px] px-[17px] pt-[9px] bg-white rounded-xl border border-[#1a1a1a]/10 justify-center items-center pb-[12.8px]  inline-flex">
            <div className="grow shrink basis-0 h-[188px] pt-2.5 flex-col justify-start inline-flex">
              <div className="self-stretch h-[188px] flex-col justify-start items-start gap-8 inline-flex">
                <div className="self-stretch h-[67px] flex-col justify-start items-start gap-1.5 flex">
                  <div className="self-stretch text-[#1a1a1a]/70 text-[13px] font-semibold font-['Noto Sans'] leading-[16.90px]">
                    Quantity
                  </div>
                  <input
                    id="quantity"
                    type="number"
                    placeholder=""
                    className="self-stretch h-11 px-[15px] py-2.5 bg-[#efeff4]/60 rounded-[5px] border border-[#babcc3]/60 text-[#8a8a8f] text-sm font-normal font-['Noto Sans']"
                  />
                </div>
                <div className="w-[498px] h-[89px] justify-center items-center inline-flex">
                  <div className="w-[498px] h-[90.80px] relative flex-col justify-start items-start flex">
                    <div className="pr-[50.59px] justify-start items-center inline-flex">
                      <div className="flex">
                        <input
                          id="check"
                          type="checkbox"
                          placeholder=""
                          className="mr-3"
                        />
                        <span className="text-[#1a1a1a]/70 text-[13px] font-normal font-['Noto Sans'] leading-[16.90px]">
                          I accept the Seabrick
                        </span>
                        <span className="text-[#1a1a1a]/70 text-[13px] font-normal font-['Noto Sans'] underline leading-[16.90px]">
                          {" "}
                          Terms of Service.
                        </span>
                      </div>
                    </div>
                    <div className="w-4 h-4 relative bg-white/0 rounded-sm shadow" />
                    <div className="w-[498px] h-11 relative bg-[#2069a0] rounded-md shadow-inner">
                      <SubmitButton
                        buttonClass="grow shrink basis-0 h-[45px] p-[17px] bg-[#2069a0] w-full rounded-[5px] justify-center items-center gap-2.5 flex"
                        label="Approve SOL Transaction"
                      ></SubmitButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BuyNFTCrypto;
