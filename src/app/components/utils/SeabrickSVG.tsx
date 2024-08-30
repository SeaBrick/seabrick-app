import React from "react";
import Image from "next/image";
import Link from "next/link";

function SeabrickSVG() {
  return (
    <Link href="/">
      <Image src="/seabrick.svg" width={250} height={45} alt="Seabrick" />
    </Link>
  );
}

export default SeabrickSVG;
