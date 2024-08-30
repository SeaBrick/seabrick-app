"use client";

import Image from "next/image";
import Container from "../utils/Container";
import { useContractContext } from "@/context/contractContext";

export default function SeabrickNFTDetails() {
  const {
    data: { seabrick },
  } = useContractContext();

  return (
    <>
      <Container>
        <div className="px-8 pt-6 pb-8 flex flex-col gap-y-4">
          <p className="text-3xl font-bold">Seabrick NFT</p>
          <div className="flex gap-x-8">
            <Image src="/nft-logo.svg" width={50} height={50} alt="Seabrick" />
            <div className="flex flex-col gap-y-2 direct-children:font-bold direct-children:direct-children:font-normal direct-children:direct-children:font-mono">
              <p>
                Name: <span>{seabrick.name}</span>
              </p>
              <p>
                Symbol: <span>{seabrick.symbol}</span>
              </p>
              <p>
                Address:<span>{seabrick.id}</span>
              </p>
              <p>
                Contract owner: <span>{seabrick.owner}</span>
              </p>
              <p>
                Total Supply: <span>{seabrick.totalSupply}</span>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
