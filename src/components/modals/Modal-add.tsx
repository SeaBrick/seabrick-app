import { XCircleIcon } from "@heroicons/react/24/outline"
import React, { useState } from "react"
import SubmitButton from "../buttons/SubmitButton"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email) || email.length <= 5) {
    return "Please enter a valid address*"
  }

  return ""
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ModalEmailProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (email: string) => void
}

const ModalEmail: React.FC<ModalEmailProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleConfirm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationError = validateEmail(email)
    if (validationError) {
      setError(validationError)
      return
    }
    setError("")
    onConfirm(email)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <XCircleIcon
        className="h-9 w-9 text-[#9b9b9b] hover:text-text-gray duration-300 hover:cursor-pointer absolute top-6 right-6"
        onClick={onClose}
      />
      <form onSubmit={handleConfirm} className="flex flex-col gap-y-4 w-full">
        <div className="flex flex-col items-start gap-y-4 w-[40rem]">
          <h3 className="text-text-gray text-4xl ">Add Admin</h3>
          <p className="text-gray-800 text-start">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Non maxime
            sapiente aspernatur nostrum! Eos voluptatum saepe rem quod,
            similique ducimus obcaecati aliquid, ipsa incidunt debitis harum est
            corrupti modi sequi!
          </p>
        </div>
        <div className="flex flex-col gap-y-4 w-full">
          <label
            htmlFor="email"
            className="text-text-gray text-sm font-normal font-['Noto Sans'] text-start"
          >
            Email
          </label>
          <input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            className="bg-gray-300 w-full py-2 px-4 rounded-md border border-[#8a8a8f] text-gray-800"
          />
          {error && (
            <p className="text-[#ff0019] text-xs font-normal font-['Noto Sans']">
              {error}
            </p>
          )}{" "}
          {/* error message */}
        </div>

        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="text-text-gray text-sm p-[17px] bg-[#efeff4] hover:bg-[#ccccd1] rounded-[5px]"
            type="button"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-white text-sm p-[17px] bg-text-gray hover:bg-text-gray/90 rounded-[5px]"
          >
            Confirm
          </button>
        </div>
      </form>
    </Modal>
  )
}

interface ModalConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  onSubmit: (email: string) => void
  email: string
}

const ModalConfirmation: React.FC<ModalConfirmationProps> = ({
  isOpen,
  onClose,
  onBack,
  onSubmit,
  email,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(email)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <XCircleIcon
        className="h-9 w-9 text-[#9b9b9b] hover:text-text-gray duration-300 hover:cursor-pointer absolute top-6 right-6"
        onClick={onClose}
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 w-full">
        <div className="flex flex-col items-start gap-y-4 w-[40rem]">
          <h3 className="text-text-gray text-4xl ">Confirm your Action</h3>
          <p className="text-[#8A8A8F] text-sm">
            Are you sure you want to transfer your contract ownership to{" "}
            <b>{email}</b>
          </p>
        </div>
        <div className="flex justify-end gap-4 w-full mt-4">
          <button
            type="button"
            onClick={onBack}
            className="text-text-gray text-sm p-[17px] bg-[#efeff4] hover:bg-[#ccccd1] rounded-[5px]"
          >
            No, I want to go back
          </button>

          <SubmitButton
            label="Yes, I want to transfer the contract ownership"
            loadingLabel="Login..."
            buttonClass="text-white text-sm p-[17px] bg-text-gray hover:bg-text-gray/90 rounded-[5px] max-w-fit"
          />
        </div>
      </form>
    </Modal>
  )
}

interface ModalSuccessProps {
  isOpen: boolean
  onClose: () => void
}

const ModalSuccess: React.FC<ModalSuccessProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <XCircleIcon
        className="h-9 w-9 text-[#9b9b9b] hover:text-text-gray duration-300 hover:cursor-pointer absolute top-6 right-6"
        onClick={onClose}
      />
      <div className="flex flex-col gap-y-4 w-[40rem]">
        <h3 className="text-text-gray text-4xl ">Confirmed</h3>
        <p className="text-[#8A8A8F] text-sm">
          Your contract ownership was succesfuly transferred to
          12bPP5EcMM6NtYvFESdGdJ34trTVN4Cr7T
        </p>
        <div className="flex justify-end gap-4 w-full mt-4">
          <button
            onClick={onClose}
            className="text-white text-sm p-[17px] bg-text-gray hover:bg-text-gray/90 rounded-[5px]"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  )
}

const App: React.FC = () => {
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [email, setEmail] = useState("")

  const handleEmailConfirm = (newEmail: string) => {
    setEmail(newEmail)
    setShowEmailModal(false)
    setShowConfirmationModal(true)
  }

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false)
  }

  const handleBackToEmailModal = () => {
    setShowConfirmationModal(false)
    setShowEmailModal(true)
  }

  const handleConfirmation = (confirmedEmail: string) => {
    console.log("Confirmed email:", confirmedEmail)
    // Aquí puedes agregar la lógica para enviar el correo electrónico
    setShowConfirmationModal(false)
    setShowSuccessModal(true) // Mostrar modal de éxito
  }

  return (
    <div>
      <button
        className="text-white text-xs font-normal font-['Noto Sans'] p-[17px] bg-text-gray hover:bg-text-gray/90 hover:bg-[#222] rounded-[5px]"
        onClick={() => setShowEmailModal(true)}
      >
        Add Admins
      </button>

      <ModalEmail
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onConfirm={handleEmailConfirm}
      />

      <ModalConfirmation
        isOpen={showConfirmationModal}
        onClose={handleCloseConfirmationModal}
        onBack={handleBackToEmailModal}
        onSubmit={handleConfirmation}
        email={email}
      />

      <ModalSuccess
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  )
}

export default App
