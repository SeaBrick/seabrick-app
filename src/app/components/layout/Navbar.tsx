"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ConnectButton from "../buttons/ConnectButton";
import SeabrickSVG from "../utils/SeabrickSVG";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="z-10 h-24 shadow mb-8">
      <div className="flex h-full items-center justify-between w-1/2 mx-auto">
        <SeabrickSVG />

        <div className="ml-60 flex gap-x-10 hover:direct-children:text-seabrick-blue">
          <Link
            className={`${pathname === "/" && "text-seabrick-blue"}`}
            href="/"
          >
            Home
          </Link>
          <Link
            className={`${pathname === "buy" && "text-seabrick-blue"}`}
            href="/buy"
          >
            Buy tokens
          </Link>
        </div>

        <div>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
