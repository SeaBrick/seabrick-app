"use client";

import { Suspense } from "react";
import ContractLoader from "../loaders/ContractLoader";

const SplashScreen = ({ children }: any) => {
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
