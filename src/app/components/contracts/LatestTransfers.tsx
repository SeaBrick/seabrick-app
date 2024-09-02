"use client";
import { Suspense } from "react";
import {
  addressResumer,
  hashResumer,
  processTime,
  timeAgo,
  wrapPromise,
} from "../../lib/utils";
import { getLatestTransfers } from "@/app/lib/subgraph";
import Container from "../utils/Container";
import Table from "../table/Table";
import TableHeader from "../table/TableHeader";
import TableBody from "../table/TableBody";
import TableBodyRow from "../table/TableBodyRow";
import PageLoaderSpinner from "../spinners/PageLoaderSpinner";

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
            <TableBodyRow key={`id-${i}`}>
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
                title={processTime(transfer.blockTimestamp).toLocaleString(
                  "en-US"
                )}
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
          <div className="py-4">
            <PageLoaderSpinner height="h-1/3" width="w-1/3" />
          </div>
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
