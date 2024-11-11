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
  ArrowDownCircleIcon,
  ArrowsUpDownIcon,
  ArrowLeftStartOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

interface AccountDropdownProps {
  num?: number;
}

export default function AccountDropdown({ num: _num }: AccountDropdownProps) {
  const { user, userType, userAddress, signOut, userRole } = useAuth();

  async function onClickSignOut() {
    await signOut();
  }
  return (
    <Menu>
      <div className="flex flex-col items-end gap-1">
        <h3 className="text-base text-dark-blue font-semibold">
          Sebastian Rojas
        </h3>
        <MenuButton className="flex text-sm items-center text-light-gray gap-1 rounded-md data-[focus]:outline-1 data-[focus]:outline-white">
          My Account
          <ChevronDownIcon className="size-4 fill-light-gray" />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="w-46 origin-top-right rounded-xl border bg-white p-1 z-50 text-right transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <MenuSection>
            <MenuItem>
              <Link
                href="/account"
                prefetch={true}
                className="group flex w-full items-center justify-end gap-2 rounded-lg py-1.5 px-4 data-[focus]:bg-black/10"
              >
                <span className="text-dark-blue font-['Montserrat'] text-sm">
                  Account Settings
                </span>
                <Cog6ToothIcon className="size-6 text-dark-blue" />
              </Link>
              {/* </button> */}
            </MenuItem>
            <MenuSeparator className="my-1 h-px bg-light-gray/10" />
            <MenuItem>
              <Link
                href="/account?tab=transactions"
                prefetch={true}
                className="group flex w-full items-center justify-end gap-2 rounded-lg py-1.5 px-4 data-[focus]:bg-black/10"
              >
                <span className="text-dark-blue font-['Montserrat'] text-sm ">
                  Transactions
                </span>
                <ArrowsUpDownIcon className="size-6 text-dark-blue" />
              </Link>
            </MenuItem>
            {(user && userRole == "admin") ||
              (userRole == "owner" && (
                <>
                  <MenuSeparator className="my-1 h-px bg-light-gray/10" />
                  <MenuItem>
                    <Link
                      href="/admin-list"
                      prefetch={true}
                      className="group flex w-full items-center justify-end gap-2 rounded-lg py-1.5 px-4 data-[focus]:bg-black/10"
                    >
                      <span className="text-dark-blue font-['Montserrat'] text-sm ">
                        Admin
                      </span>
                      <UserCircleIcon className="size-6 text-dark-blue" />
                    </Link>
                  </MenuItem>
                </>
              ))}
          </MenuSection>
          <MenuSeparator className="my-1 h-px bg-light-gray/10" />
          <MenuItem>
            <button
              onClick={onClickSignOut}
              className="group flex w-full text-dark-blue font-['Montserrat'] text-sm items-center justify-end gap-2 rounded-lg py-1.5 px-4 data-[focus]:bg-black/10"
            >
              {userType == "wallet" ? <>Disconnect</> : <>Log Out</>}
              <ArrowLeftStartOnRectangleIcon className="size-6 text-dark-blue" />
            </button>
          </MenuItem>
        </MenuItems>
      </div>
      <Image
        className="hidden md:block"
        src="/user-no-profile.webp"
        alt="user"
        width={55}
        height={55}
      />
    </Menu>
  );
}
