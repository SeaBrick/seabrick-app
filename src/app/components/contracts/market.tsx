// "use client";

// import { addresses } from "@/app/lib/contracts";
// import IMarket from "@/app/lib/contracts/abis/IMarket.json";
// import IERC20 from "@/app/lib/contracts/abis/IERC20.json";
// import { getAddress, maxUint256, toBytes } from "viem";
// import {
//   useAccount,
//   useReadContract,
//   useWaitForTransactionReceipt,
//   useWriteContract,
// } from "wagmi";
// import { useState } from "react";

// const marketData = {
//   NAMES: [
//     "0x62ddc8c5ffbd077b5a28e92efd10abcc58e66fb2a326401f0efd02e173ac1777",
//     "0xb45d52f2002a2abc1f204eb800af7cbf074250de1f754f35254efca06f7b3256",
//   ],
//   AGGREGATORS: [
//     "0xd30e2101a97dcbaebcbc04f14c3f624e67a35165",
//     "0x0153002d20b96532c639313c2d54c3da09109309",
//   ],
//   TOKENS: [
//     "0x92d05c45ac5b44ae6ac5def0bb231bc8fbdcf43a",
//     "0x7f6f413ce5b19bd7e82f811296cac78477fc607b",
//   ],
// };

// const OracleData: {
//   [key: string]: { name: string; aggregator: string; token: string };
// } = {
//   "ERC20 / USD": {
//     name: "0x62ddc8c5ffbd077b5a28e92efd10abcc58e66fb2a326401f0efd02e173ac1777",
//     aggregator: "0xd30e2101a97dcbaebcbc04f14c3f624e67a35165",
//     token: "0x92d05c45ac5b44ae6ac5def0bb231bc8fbdcf43a",
//   },
//   "USDC / USD": {
//     name: "0xb45d52f2002a2abc1f204eb800af7cbf074250de1f754f35254efca06f7b3256",
//     aggregator: "0x0153002d20b96532c639313c2d54c3da09109309",
//     token: "0x7f6f413ce5b19bd7e82f811296cac78477fc607b",
//   },
// };

// function InitMarket() {
//   const {
//     data: hash,
//     writeContract,
//     isPending,
//     error,
//     failureReason,
//   } = useWriteContract();
//   const { isLoading: isConfirming, isSuccess: isConfirmed } =
//     useWaitForTransactionReceipt({
//       hash,
//     });

//   // TODO: Add some thing of checkers for the inputs arrays or better ui
//   async function submit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     const formData = new FormData(e.target as HTMLFormElement);
//     const price = formData.get("price") as string;
//     const nftAddress = formData.get("nftAddress") as string;

//     const rawNames = formData.get("names") as string;
//     const names = rawNames.replace("[", "").replace("]", "").split(",");

//     const rawAgregators = formData.get("agregators") as string;
//     const agregators = rawAgregators
//       .replace("[", "")
//       .replace("]", "")
//       .split(",");

//     const rawTokens = formData.get("tokens") as string;
//     const tokens = rawTokens.replace("[", "").replace("]", "").split(",");

//     writeContract({
//       address: getAddress(addresses.SeabrickMarket),
//       abi: IMarket,
//       functionName: "initialization",
//       args: [BigInt(price), getAddress(nftAddress), names, agregators, tokens],
//     });
//   }

//   return (
//     <form
//       onSubmit={submit}
//       className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-y-2"
//     >
//       <input
//         className="bg-gray-300 p-2 rounded"
//         name="price"
//         placeholder="USD price"
//         required
//       />
//       <input
//         className="bg-gray-300 p-2 rounded"
//         name="nftAddress"
//         placeholder="Seabrick NFT address"
//         required
//         defaultValue={addresses.SeabrickNFT}
//       />
//       <input
//         className="bg-gray-300 p-2 rounded"
//         name="names"
//         placeholder="Names hashed keccack256"
//         required
//         defaultValue={marketData.NAMES.toString()}
//       />
//       <input
//         className="bg-gray-300 p-2 rounded"
//         name="agregators"
//         placeholder="Chainlink oracles agregators"
//         required
//         defaultValue={marketData.AGGREGATORS.toString()}
//       />
//       <input
//         className="bg-gray-300 p-2 rounded"
//         name="tokens"
//         placeholder="Payment tokens for each typo of oracle"
//         required
//         defaultValue={marketData.TOKENS.toString()}
//       />
//       <button disabled={isPending} className="bg-green-400 p-2" type="submit">
//         {isPending ? "Confirming..." : "Init contract"}
//       </button>

//       {isConfirming && <div>Waiting for confirmation...</div>}
//       {isConfirmed && <div>Transaction confirmed.</div>}

//       <button
//         onClick={() => {
//           console.log(error);
//           console.log(failureReason);
//         }}
//       ></button>
//     </form>
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

// function ApproveTokens({ selected }: { selected: string }) {
//   const oracleInfo = OracleData[selected];

//   const { data: hash, writeContract, isPending } = useWriteContract();
//   const { isLoading: isConfirming, isSuccess: isConfirmed } =
//     useWaitForTransactionReceipt({
//       hash,
//     });

//   async function submit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     const amount = maxUint256;
//     const spender = getAddress(addresses.SeabrickMarket);

//     writeContract({
//       address: getAddress(oracleInfo.token),
//       abi: IERC20,
//       functionName: "approve",
//       args: [spender, amount],
//     });
//   }

//   return (
//     <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-y-4">
//       <h1 className="text-xl">Approve token ({selected})</h1>
//       <form onSubmit={submit} className="rounded flex flex-col gap-y-2">
//         <button className="bg-green-400 p-2" type="submit">
//           {isPending ? "Confirming..." : "Approve all"}
//         </button>

//         {isConfirming && <div>Waiting for confirmation...</div>}
//         {isConfirmed && <div>Transaction confirmed.</div>}
//       </form>
//     </div>
//   );
// }

// function BuyNFT({ selected }: { selected: string }) {
//   const oracleInfo = OracleData[selected];

//   const {
//     data: hash,
//     writeContract,
//     isPending,
//     error,
//     failureReason,
//   } = useWriteContract();
//   const { isLoading: isConfirming, isSuccess: isConfirmed } =
//     useWaitForTransactionReceipt({
//       hash,
//     });

//   const { address } = useAccount();

//   async function submit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     const formData = new FormData(e.target as HTMLFormElement);
//     const buyer = getAddress(formData.get("buyer") as string);
//     // const name = toBytes(oracleInfo.name);

//     writeContract({
//       address: getAddress(addresses.SeabrickMarket),
//       abi: IMarket,
//       functionName: "buy",
//       args: [buyer, oracleInfo.name],
//     });
//   }

//   return (
//     <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-y-4">
//       <h1 className="text-xl">Buy NFT</h1>
//       <form onSubmit={submit} className="rounded flex flex-col gap-y-2">
//         <input
//           className="bg-gray-300 p-2 rounded"
//           name="buyer"
//           placeholder="Buyer of the NFT (owner of the funds)"
//           required
//           defaultValue={address}
//         />
//         <button disabled={isPending} className="bg-green-400 p-2" type="submit">
//           {isPending ? "Confirming..." : "Buy NFT"}
//         </button>
//         {hash && <div>Tx hash: {hash}</div>}
//         {isConfirming && <div>Waiting for confirmation...</div>}
//         {isConfirmed && <div>Transaction confirmed.</div>}
//         {error && (
//           <button
//             className="bg-red-300 p-2 rounded w-fit"
//             onClick={() => {
//               console.log("error: ");
//               console.log(error);
//               console.log("failureReason: ");
//               console.log(failureReason);
//             }}
//           >
//             Show errors on console
//           </button>
//         )}
//       </form>
//     </div>
//   );
// }

// export default function Market() {
//   const [selected, setSelected] = useState<string>("USDC / USD");
//   const [isChecked, setIsChecked] = useState<boolean>(false);
//   const { address, isConnecting, isDisconnected } = useAccount();

//   const { data: owner } = useReadContract({
//     abi: IMarket,
//     address: getAddress(addresses.SeabrickMarket),
//     functionName: "owner",
//   });

//   const handleCheckboxChange = () => {
//     setIsChecked(!isChecked);
//   };

//   return (
//     <>
//       <div className="w-full flex flex-col gap-y-4 shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
//         <div>Owner: {owner?.toString() ?? "No owner"}</div>
//       </div>
//       <div>
//         <SelectTokens selected={selected} setSelected={setSelected} />
//         {selected && (
//           <>
//             <ApproveTokens selected={selected} />
//             <BuyNFT selected={selected} />
//           </>
//         )}
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

//           {isChecked && <InitMarket />}
//         </>
//       </div>
//     </>
//   );
// }
