import ConnectButton from "../buttons/ConnectButton";
import SeabrickSVG from "./SeabrickSVG";

export function Navbar() {
  return (
    <>
      <div className="top sticky z-10 h-24 w-full min-w-[100vw] bg-white px-36">
        <div className="flex h-full items-center justify-between">
          <SeabrickSVG />

          <div>
            <ConnectButton />
          </div>
        </div>
      </div>
    </>
  );
}
