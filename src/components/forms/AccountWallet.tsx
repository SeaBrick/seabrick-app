import { useAuth } from "@/context/authContext";
import { UserRejectedRequestError, zeroAddress } from "viem";
import { useAccount, useSignMessage } from "wagmi";
import ConnectButton from "../buttons/ConnectButton";
import SubmitButton from "../buttons/SubmitButton";
import { changeOrLinkWallet } from "@/app/account/actions";
import { toast } from "react-toastify";

const AccountWallet: React.FC = () => {
  const { userType, userAddress, refetch: authRefetch } = useAuth();
  const { isConnected, address: connectedAddress } = useAccount();
  const { signMessageAsync } = useSignMessage();

  async function linkWalletAction(formData: FormData) {
    if (!connectedAddress) {
      // Just type safe, this is always called when is connected
      toast.error("Wallet no connected");
      return;
    }

    const params = new URLSearchParams({ address: connectedAddress });
    const response = await fetch(`/api/request_message?${params}`, {
      method: "GET",
    });

    if (!response.ok) {
      toast.error("Failed to generate message to sign");
      return;
    }

    // Since the response is ok, we safely get the message
    const messageGenerated = (await response.json()).message;

    try {
      // Ask the user to sign the message
      const messageSigned = await signMessageAsync({
        message: messageGenerated,
      });

      // Store signed message in formData
      formData.set("signature", messageSigned);
    } catch (error) {
      // If some error happened, we cancel the submission
      let errorMessage = "Unknown error found";

      if (error instanceof UserRejectedRequestError) {
        errorMessage = "User rejected the request";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        console.log(error);
      }

      toast.error(errorMessage);
      return;
    }

    // Send to the action
    const resp = await changeOrLinkWallet(formData);

    if (resp && resp.error) {
      toast.error(resp.error);
      return;
    }

    toast.success("Wallet linked succesfully!");
    authRefetch();
  }

  return (
    <div className="flex flex-col gap-y-4">
      <h3 className="text-xl font-bold leading-6">User wallet</h3>

      {userType == "wallet" && (
        <div>
          <div className="cursor-default mt-1 block w-full bg-seabrick-blue/5 border border-gray-700 rounded py-2 px-4 focus:outline-none focus:ring focus:ring-blue-500">
            {userAddress ?? zeroAddress}
          </div>
          <p className="mt-1 ml-2 text-sm">
            Your wallet address cannot be changed as it was used to create this
            account.
          </p>
        </div>
      )}

      {userType == "email" && (
        <>
          {userAddress ? (
            <div className="cursor-default mt-1 block w-full bg-seabrick-blue/5 border border-gray-700 rounded py-2 px-4 focus:outline-none focus:ring focus:ring-blue-500">
              {userAddress ?? zeroAddress}
            </div>
          ) : (
            <p className="">
              The account does not have a linked wallet. You can claim your
              Seabrick NFTs once you linked a Web3 Wallet.
            </p>
          )}

          <div className="mx-auto">
            <ConnectButton />
          </div>

          {isConnected && (
            <>
              <form
                action={linkWalletAction}
                className="pb-6 max-w-[978px] w-full mx-auto flex flex-col gap-y-4"
              >
                <input
                  hidden
                  readOnly
                  value={connectedAddress}
                  name="address"
                />

                <div className="mx-auto flex w-1/4">
                  <SubmitButton
                    disable={userAddress == connectedAddress}
                    disabledTitle={
                      userAddress == connectedAddress
                        ? "Already linked wallet"
                        : undefined
                    }
                    label={userAddress ? "Change wallet" : "Link wallet"}
                    loadingLabel={userAddress ? "Changing..." : "Linking..."}
                    buttonClass="inline-flex items-center gap-2 rounded-md bg-[#2069a0] py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-500 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                  />
                </div>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AccountWallet;
