import { Fragment, ReactNode } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

interface BaseModalProps {
  open: boolean;
  setOpen: (value: boolean, index?: number) => void;
  children: ReactNode;
}
const BaseModal = ({ open, setOpen, children }: BaseModalProps) => {
  const handleModalClose = (e: any) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };
  return (
    <>
      <Transition show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 w-0"
          onClose={() => setOpen(false)}
        >
          <div className=" min-h-screen w-0 items-center justify-center text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogPanel className="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <div className="fixed inset-0 w-screen">
              <div className="flex min-h-full items-center justify-center text-center">
                <TransitionChild
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel
                    className="z-20"
                    onClick={(e) => handleModalClose(e)}
                  >
                    {children}
                  </Dialog.Panel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default BaseModal;
