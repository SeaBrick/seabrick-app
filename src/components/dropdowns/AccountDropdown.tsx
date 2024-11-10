"use client";
import { useAuth } from "@/context/authContext";
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
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

interface AccountDropdownProps {
  num?: number;
}

export default function AccountDropdown({ num: _num }: AccountDropdownProps) {
  const { user, userType, userAddress, signOut } = useAuth();

  async function onClickSignOut() {
    await signOut();
  }

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
                  <>
                    {userAddress
                      ? addressResumer(userAddress, 3)
                      : user.user_metadata.email}
                  </>
                ) : (
                  <>{user.user_metadata.email}</>
                )}
              </>
            )}
          </MenuHeading>
          <MenuSeparator className="my-1 h-px bg-black/25" />
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10">
              <UserCircleIcon className="size-4" />
              <Link href="/account">Account details</Link>
              <kbd className="ml-auto hidden font-sans text-xs group-data-[focus]:inline">
                ⌘A
              </kbd>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10">
              <ListBulletIcon className="size-4" />
              <Link href="/account?tab=transactions">Transactions</Link>
              <kbd className="ml-auto hidden font-sans text-xs group-data-[focus]:inline">
                ⌘T
              </kbd>
            </button>
          </MenuItem>
        </MenuSection>

        <MenuSeparator className="my-1 h-px bg-black/25" />
        <MenuItem>
          <button
            onClick={onClickSignOut}
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10"
          >
            <ArrowRightStartOnRectangleIcon className="size-4" />
            {userType == "wallet" ? <>Disconnect</> : <>Sign out</>}
            <kbd className="ml-auto hidden font-sans text-xs group-data-[focus]:inline">
              ⌘D
            </kbd>
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
