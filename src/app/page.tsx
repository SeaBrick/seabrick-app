"use client";
import ERC20Mock from "./components/contracts/erc20";
import Seabrick from "./components/contracts/seabrick";
import TabList from "./components/tabs/Tablist";
import TabItem from "./components/tabs/TabItem";
import Market from "./components/contracts/market";
import { useAccount } from "wagmi";
import { getAccounts } from "./lib/subgraph";
import ContractDetail from "./components/contracts/ContractDetail";

async function aver() {
  console.log("doc_a: ", await getAccounts());
}

function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="w-1/2 mx-auto">
      <button onClick={() => aver()}>averr</button>
      <ContractDetail />
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
