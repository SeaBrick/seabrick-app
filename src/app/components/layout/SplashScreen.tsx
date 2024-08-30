"use client";

import { useContractContext } from "@/context/contractContext";
import { Suspense, useEffect, useState } from "react";
import ContractLoader from "../loaders/ContractLoader";

const SplashScreen = ({ children }: any) => {
  const { data, dispatch } = useContractContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getSeabrickNftData = async () => {
    // const resp = await getSeabrickContract(addresses.SeabrickNFT);
    // dispatch((prevData) => ({
    //   ...prevData,
    //   seabrick: resp,
    // }));
  };

  async function loadData() {
    await getSeabrickNftData();
    setIsLoading(false);
  }

  useEffect(() => {
    loadData();
  });

  return (
    <>
      <Suspense
        fallback={
          // This is the main spinner that will be show on load
          <div className="mx-auto w-60">Loading...</div>
        }
      >
        {/* Main node data for the app. NOTE: it is totally blocker, it will wait for 
        this before showing the app*/}
        <ContractLoader />

        {children}
      </Suspense>
    </>
  );
};

export default SplashScreen;
