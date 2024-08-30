"use client";
import ConnectButton from "../buttons/ConnectButton";
import SeabrickSVG from "../utils/SeabrickSVG";

export function Navbar() {
  return (
    <header className="z-10 h-24 shadow">
      <div className="flex h-full items-center justify-between w-1/2 mx-auto">
        <SeabrickSVG />

        <div>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
