"use client";
import ContractDetail from "./components/contracts/SeabrickNFTDetails";
import LatestBuys from "./components/contracts/LatestBuys";
import LatestTransfers from "./components/contracts/LatestTransfers";

function Home() {
  return (
    <div className="w-1/2 mx-auto flex flex-col gap-y-8">
      <ContractDetail />
      <LatestBuys />
      <LatestTransfers />
    </div>
  );
}

export default Home;
