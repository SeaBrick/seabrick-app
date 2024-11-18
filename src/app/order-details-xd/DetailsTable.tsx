// "use client";
import Image from "next/image";
import Table from "@/components/table/TableTest";
import { formatUnits, type Hex } from "viem";
import type {
  PaymentToken,
  SingleBuyByTxResponse,
} from "@/lib/interfaces/subgraph";
import { processTime, timeAgo } from "@/lib/utils";
import { getTxBlockExplorer } from "@/config/chains";
import Link from "next/link";

interface CryptoTable {
  type: "crypto";
  txHash: Hex;
  paymentToken: PaymentToken;
  totalAmountPaid: bigint;
  tokensId: string[];
  blockNumber: string;
  blockTimestamp: string;
  buysData: SingleBuyByTxResponse[];
}

interface StripeTable {
  type: "stripe";
  stripeId: string;
  tokensId: string[];
  totalAmount: number;
  currency: string;
  txHash: string;
  buyerEmail: string;
  createdAt: string;
}

export type DetailsTableProps = CryptoTable | StripeTable;

const DetailsTable: React.FC<DetailsTableProps> = (
  props: DetailsTableProps
) => {
  const symbol = props.type == "crypto" ? props.paymentToken.symbol : "US$";
  let totalPaid = "0";

  // timeAgo(processTime)
  const columnDataTest2 = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bodyDataTest2: { [s: string]: any }[] = [];

  if (props.type == "crypto") {
    // Total paid in crpto
    totalPaid = parseFloat(
      formatUnits(props.totalAmountPaid, parseInt(props.paymentToken.decimals))
    ).toFixed(2);

    // date: timeAgo(processTime(props.blockTimestamp)),
    // href: true,
    // hrefParse: (value: any) => {
    //   return getTxBlockExplorer(value) ?? value;
    // },

    columnDataTest2.push(
      ...[
        { key: "tokenId", label: "Token Id" },
        { key: "status", label: "Status" },
        { key: "individualPrice", label: "Price unitary" },
      ]
    );
    props.tokensId.forEach((tokenId_, i) => {
      bodyDataTest2.push({
        tokenId: tokenId_,
        status: "Confirmed",
        individualPrice:
          parseFloat(
            formatUnits(
              BigInt(props.buysData[i].amountPaid),
              parseInt(props.paymentToken.decimals)
            )
          ).toFixed(2) +
          " " +
          props.paymentToken.symbol,
      });
    });
  } else {
    // Stripe
    columnDataTest2.push(
      ...[
        { key: "tokenId", label: "Token Id" },
        { key: "status", label: "Status" },
        {
          key: "hash",
          label: "TX Hash",
        },
        { key: "date", label: "Date" },
      ]
    );

    bodyDataTest2.push(
      ...[
        {
          tokenId: 2,
          status: "true",
          hash: "0x0000000000000000000",
          date: "01/01/2024",
        },
        {
          tokenId: 3,
          status: "cccc",
          hash: "0x1000000000000000000",
          date: "01/02/2024",
        },
        {
          tokenId: 4,
          status: "asdasd",
          hash: "0x0001000000000000000000",
          date: "01/03/2024",
        },
      ]
    );
  }

  // // Stripe
  // const columnDataTest = [
  //   { key: "tokenId", label: "Token Id" },
  //   { key: "status", label: "Status" },
  //   { key: "hash", label: "TX Hash" },
  //   { key: "date", label: "Date" },
  // ];

  // const bodyDataTest = [
  //   {
  //     tokenId: 2,
  //     status: "true",
  //     hash: "0x0000000000000000000",
  //     date: "01/01/2024",
  //   },
  //   {
  //     tokenId: 3,
  //     status: "cccc",
  //     hash: "0x1000000000000000000",
  //     date: "01/02/2024",
  //   },
  //   {
  //     tokenId: 4,
  //     status: "asdasd",
  //     hash: "0x0001000000000000000000",
  //     date: "01/03/2024",
  //   },
  // ];

  return (
    <div className=" min-w-[200px] box-content p-6 bg-white rounded-[10px] justify-center items-center gap-2.5 flex m-auto flex-col mb-4 w-full">
      <div className="self-stretch h-auto flex-col justify-start items-start gap-6 flex">
        <div className="self-stretch justify-start items-center gap-4 inline-flex">
          <Image
            className="w-[65px] h-[62px]"
            src={`/brick.webp`}
            alt="logo"
            width={65}
            height={62}
          />
          <div className="flex-col justify-between items-start inline-flex">
            <div className="justify-start items-center gap-2.5 inline-flex">
              <div className="text-[#8a8a8f] text-[15px] font-normal font-['Noto Sans']">
                Seabrick NFT
              </div>
            </div>
            <div className="self-stretch justify-start items-end gap-2.5 inline-flex text-[#323232] text-4xl font-normal font-['Noto Sans'] w-auto">
              <span>
                {totalPaid} {symbol}
              </span>
            </div>
          </div>
        </div>
        {props.type == "crypto" && (
          <div className="text-lg font-['Noto Sans'] flex flex-col">
            <div>
              <span className="font-semibold">Transaction hash: </span>
              <Link
                href={getTxBlockExplorer(props.txHash) ?? ""}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 hover:underline"
              >
                {props.txHash}
              </Link>
            </div>
            <div className="flex gap-x-4">
              <div>
                <span className="font-semibold">Date: </span>
                <span>{timeAgo(processTime(props.blockTimestamp))}</span>
              </div>
              <div>
                <span className="font-semibold">Block number: </span>
                <span>{props.blockNumber}</span>
              </div>
              <div>
                <span className="font-semibold">Block timestamp: </span>
                <span>{props.blockTimestamp}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mb-4 w-full">
        <Table columns={columnDataTest2} data={bodyDataTest2} />
      </div>
    </div>
  );
};

export default DetailsTable;
