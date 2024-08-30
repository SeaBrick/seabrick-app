"use client";
import { useEffect, useState } from "react";

const SplashScreen = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function wait(time: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  async function loadData() {
    await wait(5000);
    setIsLoading(false);
  }

  useEffect(() => {
    loadData();
  });

  return isLoading ? <div>Loading...</div> : <>{children}</>;
};

export default SplashScreen;
