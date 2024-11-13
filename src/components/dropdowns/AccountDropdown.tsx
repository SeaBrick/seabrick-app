"use client";
import { useAuth } from "@/context/authContext";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSeparator,
  MenuSection,
} from "@headlessui/react";
import {
  UserCircleIcon,
  ArrowsUpDownIcon,
  ArrowLeftStartOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { UserProfile } from "../images/UserProfile";
import { Fragment } from "react";
import UserName from "../auth/UserName";

interface AccountDropdownProps {
  num?: number;
}

export default function AccountDropdown(_props: AccountDropdownProps) {
  const { user, signOut, userRole } = useAuth();

  async function onClickSignOut() {
    await signOut();
  }
  return (
    <Menu>
      <div className="flex flex-col items-end gap-1">
        <h3 className="text-base text-dark-blue font-semibold">
          <UserName resumeAddressBy={3} />
        </h3>
        <MenuButton as={Fragment}>
          {({ active }) => (
            <button className="flex text-sm items-center text-light-gray gap-1 rounded-md data-[focus]:outline-1 data-[focus]:outline-white">
              <span>My Account</span>
              <span
                className={`transition-transform duration-200 ${active ? "rotate-180" : "rotate-0"}`}
              >
                <ChevronDownIcon className="size-4 fill-light-gray mt-0.5" />
              </span>
            </button>
          )}
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

            {user && (userRole == "admin" || userRole == "owner") && (
              <>
                <MenuSeparator className="my-1 h-px bg-light-gray/10" />
                <MenuItem>
                  <Link
                    href="/admin"
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
            )}
          </MenuSection>
          <MenuSeparator className="my-1 h-px bg-light-gray/10" />
          <MenuItem>
            <button
              onClick={onClickSignOut}
              className="group flex w-full items-center justify-end gap-2 rounded-lg py-1.5 px-4 data-[focus]:bg-black/10"
            >
              <span className="text-dark-blue font-['Montserrat'] text-sm ">
                Log Out
              </span>
              <ArrowLeftStartOnRectangleIcon className="size-6 text-dark-blue" />
            </button>
          </MenuItem>
        </MenuItems>
      </div>

      <UserProfile width={55} height={55} />
    </Menu>
  );
}
