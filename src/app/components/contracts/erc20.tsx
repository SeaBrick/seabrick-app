// "use client";

// import { addresses } from "@/app/lib/contracts";
// import IERC20 from "@/app/lib/contracts/abis/IERC20.json";
// import { getAddress, formatUnits } from "viem";
// import { useAccount, useReadContract, useWriteContract } from "wagmi";
// import { OracleData } from "./data";
// import { useState } from "react";

// function MintTokens({ selected }: { selected: string }) {
//   const oracleInfo = OracleData[selected];

//   const { data: hash, writeContract } = useWriteContract();

//   async function submit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     const formData = new FormData(e.target as HTMLFormElement);
//     const amount = formData.get("amount") as string;
//     const toAddress = formData.get("to") as string;

//     writeContract({
//       address: getAddress(oracleInfo.token),
//       abi: IERC20,
//       functionName: "mint",
//       args: [getAddress(toAddress), BigInt(amount)],
//     });
//   }

//   return (
//     <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-y-4">
//       <h1 className="text-xl">Get funds</h1>

//       <form onSubmit={submit} className="rounded flex flex-col gap-y-2">
//         <input
//           className="bg-gray-300 p-2 rounded"
//           name="amount"
//           placeholder="Amount"
//           required
//         />
//         <input
//           className="bg-gray-300 p-2 rounded"
//           name="to"
//           placeholder="Address destinatary"
//           required
//         />
//         <button className="bg-green-400 p-2" type="submit">
//           Mint
//         </button>

//         {hash && <div>Transaction Hash: {hash}</div>}
//       </form>
//     </div>
//   );
// }

// function SelectTokens({ selected, setSelected }: any) {
//   const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const { value } = e.target;
//     setSelected(value);
//   };

//   return (
//     <>
//       <form className="max-w-sm mx-auto">
//         <label htmlFor="oracles" className="block mb-2 text-sm font-medium">
//           Select an payment
//         </label>
//         <select
//           onChange={(e) => handleSelectChange(e)}
//           defaultValue={selected}
//           id="countries"
//           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//         >
//           {Object.keys(OracleData).map((oracleName, i) => (
//             <option key={oracleName + i} value={oracleName}>
//               {oracleName}
//             </option>
//           ))}
//         </select>
//       </form>
//     </>
//   );
// }

// export function TokenData({ selected }: { selected: string }) {
//   const oracleInfo = OracleData[selected];

//   const { address } = useAccount();

//   const { data: decimals } = useReadContract({
//     abi: IERC20,
//     address: getAddress(oracleInfo.token),
//     functionName: "decimals",
//   });

//   const { data: totalSupply } = useReadContract({
//     abi: IERC20,
//     address: getAddress(oracleInfo.token),
//     functionName: "totalSupply",
//   });

//   const { data: balance } = useReadContract({
//     abi: IERC20,
//     address: getAddress(oracleInfo.token),
//     functionName: "balanceOf",
//     args: [address],
//   });

//   return (
//     <>
//       <div>
//         Wallet balance:{" "}
//         {formatUnits(
//           BigInt(balance?.toString() || "0"),
//           Number(decimals?.toString() || 1)
//         ).toString()}{" "}
//         ({decimals?.toString() || 1} decimals)
//       </div>

//       <div>
//         Total supply:{" "}
//         {formatUnits(
//           BigInt(totalSupply?.toString() || "0"),
//           Number(decimals?.toString() || 1)
//         ).toString()}{" "}
//         ({decimals?.toString() || 1} decimals)
//       </div>
//     </>
//   );
// }

// export default function Market() {
//   const [selected, setSelected] = useState<string>("USDC / USD");

//   return (
//     <>
//       <div className="w-full flex flex-col gap-y-4 shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
//         <SelectTokens selected={selected} setSelected={setSelected} />
//         <TokenData selected={selected} />
//       </div>
//       <div>
//         {selected && (
//           <>
//             <MintTokens selected={selected} />
//           </>
//         )}
//       </div>
//     </>
//   );
// }
