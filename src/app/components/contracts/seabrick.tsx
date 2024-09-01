// "use client";

// import { addresses } from "@/app/lib/contracts";
// import ISeabrick from "@/app/lib/contracts/abis/ISeabrick.json";
// import { useState } from "react";
// import { getAddress } from "viem";
// import {
//   useAccount,
//   useReadContract,
//   useWaitForTransactionReceipt,
//   useWriteContract,
// } from "wagmi";

// function TokenData() {
//   const { address } = useAccount();

//   const { data: totalSupply } = useReadContract({
//     abi: ISeabrick,
//     address: getAddress(addresses.SeabrickNFT),
//     functionName: "totalSupply",
//   });

//   const { data: symbol } = useReadContract({
//     abi: ISeabrick,
//     address: getAddress(addresses.SeabrickNFT),
//     functionName: "symbol",
//   });
//   const { data: name } = useReadContract({
//     abi: ISeabrick,
//     address: getAddress(addresses.SeabrickNFT),
//     functionName: "name",
//   });

//   return (
//     <div className="w-full flex flex-col gap-y-4 shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
//       <div>Name: {"SeaBrick NFT"}</div>
//       <div>Symbol: {"SB_NFT"}</div>
//       {/* <div>Name: {name ? name?.toString() : "SeaBrick NFT"}</div>
//       <div>Symbol: {symbol?.toString() || "SB_NFT"}</div> */}
//       <div>Total Supply: {totalSupply?.toString()}</div>
//     </div>
//   );
// }

// function InitSeabrick() {
//   const { data: hash, writeContract, isPending } = useWriteContract();
//   const { isLoading: isConfirming, isSuccess: isConfirmed } =
//     useWaitForTransactionReceipt({
//       hash,
//     });

//   async function submit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     const formData = new FormData(e.target as HTMLFormElement);
//     const ownerAddress = formData.get("owner") as string;

//     writeContract({
//       address: getAddress(addresses.SeabrickNFT),
//       abi: ISeabrick,
//       functionName: "initialization",
//       args: [getAddress(ownerAddress)],
//     });
//   }

//   return (
//     <form
//       onSubmit={submit}
//       className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-y-2"
//     >
//       <input
//         className="bg-gray-300 p-2 rounded"
//         name="owner"
//         placeholder="Address owner"
//         required
//         defaultValue={addresses.SeabrickMarket}
//       />
//       <button disabled={isPending} className="bg-green-400 p-2" type="submit">
//         {isPending ? "Confirming..." : "Init contract"}
//       </button>

//       {isConfirming && <div>Waiting for confirmation...</div>}
//       {isConfirmed && <div>Transaction confirmed.</div>}
//     </form>
//   );
// }

// export default function Seabrick() {
//   const { address, isConnecting, isDisconnected } = useAccount();
//   const [isChecked, setIsChecked] = useState<boolean>(false);

//   const { data: owner } = useReadContract({
//     abi: ISeabrick,
//     address: getAddress(addresses.SeabrickNFT),
//     functionName: "owner",
//   });

//   const handleCheckboxChange = () => {
//     setIsChecked(!isChecked);
//   };

//   return (
//     <>
//       <div className="w-full flex flex-col gap-y-4 shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
//         <div>Owner: {owner?.toString()}</div>
//       </div>

//       <>
//         <TokenData />
//       </>

//       <div>
//         <>
//           <div className="flex items-center mb-4">
//             <input
//               id="default-checkbox"
//               type="checkbox"
//               checked={isChecked}
//               onChange={handleCheckboxChange}
//               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//             />
//             <label
//               htmlFor="default-checkbox"
//               className="ms-2 text-sm font-medium text-neutral-500 hover:text-black"
//             >
//               Show initialization method
//             </label>
//           </div>

//           {isChecked && <InitSeabrick />}
//         </>
//       </div>
//     </>
//   );
// }
