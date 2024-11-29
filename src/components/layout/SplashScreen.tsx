"use client";

import React, { Suspense } from "react";
import ContractLoader from "../loaders/ContractLoader";
import LogoFlash from "../spinners/LogoFlash";

interface SplashScreenProps {
  children: React.ReactNode;
}
const SplashScreen = ({ children }: SplashScreenProps) => {
  return (
    <>
      <Suspense
        fallback={
          <div className="w-1/2 mx-auto mt-80">
            <div className="py-24 my-auto">              
              <LogoFlash widthLogo={70} heightLogo={70}/>
            </div>
          </div>
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
