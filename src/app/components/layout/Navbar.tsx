import ConnectButton from "../buttons/ConnectButton";
import SeabrickSVG from "./SeabrickSVG";

export function Navbar() {
  return (
    // <header className="top right -mr-20 sticky z-10 h-24 w-full min-w-[100vw] bg-white">
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
