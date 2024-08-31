import { Dispatch, ReactNode, SetStateAction } from "react";
import Container from "../utils/Container";
import Modal from "./Modal";
import { Token } from "@/app/lib/interfaces";

interface ModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  token: Token;
}
export default function GetFundsModal({ open, setOpen }: ModalProps) {
  return (
    <Modal open={open} setOpen={setOpen}>
      <Container>
        <div className="border rounded py-4 px-8">
          <p>Get test funds!</p>
        </div>
      </Container>
    </Modal>
  );
}
