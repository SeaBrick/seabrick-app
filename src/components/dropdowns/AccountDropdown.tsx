import { useAuth } from "@/context/authContext";
import { createClient } from "@/lib/supabase/client";
import { addressResumer } from "@/lib/utils";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSeparator,
  MenuSection,
  MenuHeading,
} from "@headlessui/react";
import {
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDisconnect } from "wagmi";

interface AccountDropdownProps {
  num?: number;
}

export default function AccountDropdown({ num: _num }: AccountDropdownProps) {
  const { user } = useAuth();
  const [userType, setUserType] = useState<"email" | "wallet">();
  const { disconnectAsync } = useDisconnect();

  useEffect(() => {
    if (user) {
      if (user.user_metadata.type == "email") {
        setUserType("email");
      } else {
        setUserType("wallet");
      }
    } else {
      setUserType(undefined);
    }
  }, [user]);

  return (
    <Menu>
      <MenuButton className="flex items-center text-white p-2 gap-2 rounded-md bg-seabrick-blue py-1.5 px-3 data-[hover]:bg-seabrick-blue/85 data-[open]:bg-seabrick-blue/85 data-[focus]:outline-1 data-[focus]:outline-white">
        Account
        <UserIcon className="size-4 fill-white" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="w-52 origin-top-right rounded-xl border bg-white p-1 z-50 text-right transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuSection>
          <MenuHeading className="text-sm opacity-50 mx-auto w-fit mb-2">
            {user && (
              <>
                {userType == "wallet" ? (
                  <>{addressResumer(user.user_metadata.address, 3)}</>
                ) : (
                  <>{user.user_metadata.email}</>
                )}
              </>
            )}
          </MenuHeading>
          <MenuSeparator className="my-1 h-px bg-black/25" />
          <MenuItem>
            {/* TODO: Add redirect to page /account/details */}
            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10">
              <UserCircleIcon className="size-4" />
              <Link href="/account/details">Account details</Link>
              <kbd className="ml-auto hidden font-sans text-xs group-data-[focus]:inline">
                ⌘A
              </kbd>
            </button>
          </MenuItem>
        </MenuSection>

        <MenuSeparator className="my-1 h-px bg-black/25" />
        <MenuItem>
          <button
            onClick={async () => {
              if (userType == "wallet") {
                await disconnectAsync();
              } else {
                const { error } = await createClient().auth.signOut();
                if (error) {
                  // TODO: set error modal
                  console.log(error);
                }
              }
            }}
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10"
          >
            <ArrowRightStartOnRectangleIcon className="size-4" />
            {userType == "wallet" ? <>Disconnect</> : <>Sign out</>}
            <kbd className="ml-auto hidden font-sans text-xs group-data-[focus]:inline">
              ⌘S
            </kbd>
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
