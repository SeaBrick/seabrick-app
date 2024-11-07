"use client"
import { copyText } from "@/lib/utils"
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline"
import React, { useState } from "react"

interface TextCopierProps {
  text: string
}

const TextCopier: React.FC<TextCopierProps> = ({ text }) => {
  const [hover, setHover] = useState(false)
  const [textCopy, setTextCopy] = useState(false)
  const onHover = () => {
    setHover(true)
    setTextCopy(false)
  }

  const onLeave = () => {
    setHover(false)
  }
  const handleCopyClick = async () => {
    const copySuccess = await copyText(text)
    if (copySuccess) {
      setTextCopy(true)
    }
  }
  return (
    <div
      className="relative h-[1.05rem] w-[1.05rem] cursor-pointer ml-[3px] mt-[-3px] opacity-80"
      onClick={handleCopyClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <DocumentDuplicateIcon />
      {hover ? (
        <div className="absolute -left-4 -top-9 transition-all duration-200">
          <div className="min-w-14 whitespace-nowrap rounded-lg bg-gray-800 px-2 py-1 text-center text-sm font-medium text-white">
            {textCopy ? "Text Copied!" : "Copy"}
          </div>
          <div className="flex w-11 justify-center overflow-hidden">
            <div className="h-3 w-3 origin-top-left -rotate-45 transform bg-gray-800"></div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default TextCopier
