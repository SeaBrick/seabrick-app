import ConnectButton from "./buttons/ConnectButton";

export function Navbar() {
  return (
    <>
      <div className="top sticky z-10 h-20 w-full min-w-[100vw] bg-white px-14 shadow">
        <div className="flex h-full items-center justify-between">
          <h1 className="text-black">Seabrick App</h1>

          <div>
            <ConnectButton />
          </div>
        </div>
      </div>
    </>
  );
}
