"use client";
import { Suspense } from "react";
import {
  addressResumer,
  hashResumer,
  processTime,
  timeAgo,
  wrapPromise,
} from "../utils";
import { getLatestBuys } from "@/app/lib/subgraph";
import Container from "../utils/Container";
import Table from "../table/Table";
import TableHeader from "../table/TableHeader";
import TableBody from "../table/TableBody";
import TableBodyRow from "../table/TableBodyRow";

const getLatestBuysInfo = async () => {
  return await getLatestBuys();
};

const getData = wrapPromise(getLatestBuysInfo());

const LatestBuysData: React.FC = () => {
  const data = getData.read();

  return (
    <Table>
      <TableHeader>
        <th scope="col">Token ID</th>
        <th scope="col">Buyer</th>
        <th scope="col">Transaction hash</th>
        <th scope="col">Time</th>
      </TableHeader>
      <TableBody>
        {data &&
          data.map((buy, i) => (
            <TableBodyRow uniqueId={`id-${i}`}>
              <td className="text-black">{buy.tokenId}</td>
              <td title={buy.buyer} className="text-black">
                {addressResumer(buy.buyer, 3)}
              </td>
              <td title={buy.transactionHash} className="text-black">
                {hashResumer(buy.transactionHash, 3)}
              </td>
              <td
                title={processTime(buy.blockTimestamp).toLocaleString()}
                className="text-black"
              >
                {timeAgo(processTime(buy.blockTimestamp))}
              </td>
            </TableBodyRow>
          ))}
      </TableBody>
    </Table>
  );
};

const LatestBuys: React.FC = () => {
  return (
    <>
      <Suspense
        fallback={
          // This is the main spinner that will be show on load
          <div className="mx-auto w-60">Loading...</div>
        }
      >
        <Container>
          <div className="px-8 pt-6 pb-8 flex flex-col gap-y-4">
            <p className="text-2xl font-bold">Latest buys</p>

            <LatestBuysData />
          </div>
        </Container>
      </Suspense>
    </>
  );
};

export default LatestBuys;
