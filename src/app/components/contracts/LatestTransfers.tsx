"use client";
import { Suspense, useEffect, useState } from "react";
import {
  addressResumer,
  formatDate,
  hashResumer,
  processTime,
  timeAgo,
  wrapPromise,
} from "../utils";
import { getLatestTransfers } from "@/app/lib/subgraph";
import Container from "../utils/Container";
import Table from "../table/Table";
import TableHeader from "../table/TableHeader";
import TableBody from "../table/TableBody";
import TableBodyRow from "../table/TableBodyRow";

const getLatestTransfersInfo = async () => {
  return await getLatestTransfers();
};

const getData = wrapPromise(getLatestTransfersInfo());

const LatestTransfersData: React.FC = () => {
  const data = getData.read();

  return (
    <Table>
      <TableHeader>
        <th scope="col">Transaction hash</th>
        <th scope="col">From</th>
        <th scope="col">To</th>
        <th scope="col">Time</th>
      </TableHeader>
      <TableBody>
        {data &&
          data.map((transfer, i) => (
            <TableBodyRow uniqueId={`id-${i}`}>
              <td title={transfer.transactionHash} className="text-black">
                {hashResumer(transfer.transactionHash, 3)}
              </td>
              <td title={transfer.from} className="text-black">
                {addressResumer(transfer.from, 3)}
              </td>
              <td title={transfer.to} className="text-black">
                {addressResumer(transfer.to, 3)}
              </td>
              <td
                title={processTime(transfer.blockTimestamp).toLocaleString()}
                className="text-black"
              >
                {timeAgo(processTime(transfer.blockTimestamp))}
              </td>
            </TableBodyRow>
          ))}
      </TableBody>
    </Table>
  );
};

const LatestTransfers: React.FC = () => {
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
            <p className="text-2xl font-bold">Latest transfers</p>

            <LatestTransfersData />
          </div>
        </Container>
      </Suspense>
    </>
  );
};

export default LatestTransfers;