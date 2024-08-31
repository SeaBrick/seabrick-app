"use client";
import ERC20Mock from "./components/contracts/erc20";
import Seabrick from "./components/contracts/seabrick";
import TabList from "./components/tabs/Tablist";
import TabItem from "./components/tabs/TabItem";
import Market from "./components/contracts/market";
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
