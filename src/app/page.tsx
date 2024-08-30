"use client";
import ERC20Mock from "./components/contracts/erc20";
import Seabrick from "./components/contracts/seabrick";
import TabList from "./components/tabs/Tablist";
import TabItem from "./components/tabs/TabItem";
import Market from "./components/contracts/market";
import ContractDetail from "./components/contracts/SeabrickNFTDetails";
import LatestBuys from "./components/contracts/LatestBuys";
import { useAccount } from "wagmi";

function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="w-1/2 mx-auto pt-8 flex flex-col gap-y-8">
      <ContractDetail />
      <LatestBuys />

      {isConnected ? (
        <>
          <div className="mb-8 mt-14 text-2xl text-gray-800">Contracts</div>

          <div className="">
            <TabList>
              <TabItem label="Market">
                <Market />
              </TabItem>
              <TabItem label="Seabrick">
                <Seabrick />
              </TabItem>
              <TabItem label="Get test funds">
                <ERC20Mock />
              </TabItem>
            </TabList>
          </div>
        </>
      ) : (
        <div className="mb-8 mt-14 text-2xl text-gray-800">
          Please, connect your wallet
        </div>
      )}
    </div>
  );
}

export default Home;
