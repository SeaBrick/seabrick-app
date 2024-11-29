"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import * as ejs from "ejs"
import { createClient } from "@/lib/supabase/client"
import { zeroHash } from "viem"
import { toast } from "react-toastify"
export default function RenderTest() {
  const [activeEditor, setActiveEditor] = useState(false)
  const [activateInstructions, setActivateInstructions] = useState(true)
  const [originalTemplate, setOriginalTemplate] = useState("")
  const [disableSave, setDisableSave] = useState(true)
  const [template, setTemplate] = useState("")
  const [render, setRender] = useState("<p>Your result Here</p>")

  const router = useRouter()

  const variables = {
    email: "The email of the token buyer",
    tokenIds: "The IDs of the token obtained",
    date: "Date of the buy",
    txHash:
      "The blockchain transaction hash that verified the creation of the tokens",
    logoUrl: "The Seabrick logo URL",
  }

  function templateOnChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setTemplate(e.target.value)
    setDisableSave(true)
  }

  function renderRawHtml(rawHtml: string): string {
    try {
      // This use mocked data since we are doing previews
      const html = ejs.render(rawHtml, {
        email: "user.email@example.com",
        date: new Date().toLocaleDateString(),
        tokenIds: [1, 6, 20],
        txHash: zeroHash,
        img_url: "/seabrick.svg",
      })
      return html
    } catch (error) {
      let errorMessage = "Failed to render the HTML provided"
      setDisableSave(true)
      if (error instanceof Error) {
        errorMessage = error.message.match(/(.*? is not defined)/)![1]
      }

      toast.error(errorMessage)
      return rawHtml
    }
  }

  function captureText(formData: FormData) {
    const raw = formData.get("raw") as string
    setDisableSave(false)
    const html = renderRawHtml(raw)
    setRender(html)
    setTemplate(raw)
  }

  async function saveTemplate() {
    const { error } = await createClient()
      .from("email_templates")
      .update({ raw_html: template })
      .eq("id", "receipt")

    if (error) {
      console.error(error)
      toast.error("Failed to save the template")
      return
    }
    toast.success("Template saved succesfully!")
    setDisableSave(true)
  }

  useEffect(() => {
    async function getReceiptTemplate() {
      const { error, data } = await createClient()
        .from("email_templates")
        .select("raw_html")
        .eq("id", "receipt")
        .single<{ raw_html: string }>()

      // TODO: Add some error catcher
      if (error) {
        console.error(error)
        throw error
      }

      // Save the raw html
      setOriginalTemplate(data.raw_html)
      setTemplate(data.raw_html)

      // Render it with some mocke data
      const html = renderRawHtml(data.raw_html)
      setRender(html)
    }

    // Call the function
    getReceiptTemplate()
  }, [])

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "Enter") {
        const renderButton = document.getElementById("render-button")
        renderButton?.click()
      }
    }
    document.addEventListener("keydown", listener)
    return () => {
      document.removeEventListener("keydown", listener)
    }
  }, [])

  return (
    <div>
      <form className="h-full flex flex-col p-4 gap-2" action={captureText}>
        <div className="w-full flex justify-between">
          <div className="w-full flex justify-start gap-2">
            <button
              className="px-4 py-2 text-white text-base rounded-md hover:cursor-pointer bg-seabrick-green active:bg-teal-400 hover:bg-teal-700 disabled:bg-gray-300 disabled:text-gray-600 disabled:hover:cursor-default"
              onClick={saveTemplate}
              disabled={disableSave}
              type="button"
            >
              Save
            </button>

            <button
              className="px-4 py-2 bg-light-gray text-white text-base rounded-md hover:cursor-pointer hover:bg-gray-600 active:bg-gray-400"
              onClick={() => router.push("/admin")}
              type="button"
            >
              Go Back
            </button>
          </div>
          <div className="w-full flex justify-end gap-2">
            {activeEditor && (
              <>
                <span className="self-center mr-2 text-gray-800">
                  Press Ctrl + Enter to Render
                </span>
                <button
                  id="render-button"
                  className="px-4 py-2 bg-red-600 text-white text-base rounded-md hover:cursor-pointer hover:bg-red-700 active:bg-red-500"
                  type="submit"
                >
                  Render
                </button>
              </>
            )}
            <button
              className="px-4 py-2 bg-seabrick-blue text-white text-base rounded-md hover:cursor-pointer hover:bg-blue-600 active:bg-[#4290d6]"
              type="button"
              onClick={() => {
                if (activeEditor) {
                  // this mean we close
                  setTemplate(originalTemplate)
                }
                setActiveEditor(!activeEditor)
              }}
            >
              {activeEditor ? "Close Editor" : "Open Editor"}
            </button>
            <button
              className="px-4 py-2 bg-amber-500 text-white text-base rounded-md hover:cursor-pointer hover:bg-amber-600 active:bg-amber-400"
              type="button"
              onClick={() => {
                setActivateInstructions(!activateInstructions)
              }}
            >
              {activateInstructions
                ? "Close Instructions"
                : "Open Instructions"}
            </button>
          </div>
        </div>

        <div id="render-area" className="w-full h-full flex gap-4">
          <div
            id="instructions-area"
            className={`w-full flex gap-y-2 flex-col rounded-xl border-2 border-seabrick-green bg-white p-3 ${activateInstructions ? "block" : "hidden"}`}
          >
            <p>
              This is an HTML Editor powered by <strong>ejs</strong>. Please
              write everything in plain HTML.
            </p>

            <p className="flex gap-x-2">
              <span>To add variables, to it in the format:</span>
              <code className="bg-gray-200 py-[1px] px-1 rounded-md">{`<%={variable}%>`}</code>
            </p>
            <p className="flex flex-col">
              <span>Example:</span>
              <code className="bg-gray-200 p-4 rounded-md">{`<p>Email sent to <%=email%></p>`}</code>
            </p>

            <p className="flex flex-col">
              <span>Expected Output:</span>
              <code className="bg-gray-200 p-5 rounded-md">
                Email sent to user@example.com
              </code>
            </p>

            <div className="my-2">
              <p> These are the variables availables to be use:</p>
              <ul className="list-disc pl-5 ">
                {Object.entries(variables).map(([name, text], index) => {
                  return (
                    <li key={`${name}-${index}`}>
                      <code className="bg-gray-200 py-[1px] px-1 rounded-md">
                        {name}
                      </code>
                      <span className="mr-1">:</span>
                      <span>{text}</span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <p>
              Press the{" "}
              <span className="bg-red-300 p-1 rounded-md">Render</span> button
              to visualize your code.
            </p>
            <p>
              After rendering, you can press{" "}
              <span className="bg-green-300 p-1 rounded-md">Save</span> button
              to save the template.
            </p>
            <p>
              For more information about conditionals and loops, visit the EJS
              documentation{" "}
              <a
                className="text-seabrick-blue underline"
                href="https://ejs.co/#docs"
              >
                here
              </a>
            </p>
          </div>

          <div
            id="editor-area"
            className={`w-full flex-col rounded-xl ${activeEditor ? "flex" : "hidden"}`}
          >
            <div id="input-area" className="flex w-full h-full">
              <textarea
                className="bg-white border-sky-700 border-2 w-full h-full p-3 rounded-xl"
                name="raw"
                value={template}
                onChange={templateOnChange}
                spellCheck="false"
                placeholder={`Your code here`}
              ></textarea>
            </div>
          </div>

          <div
            id="preview-area"
            className={`h-auto w-full bg-white rounded-xl p-4 overflow-auto border-2 border-seabrick-green`}
          >
            <div
              id="render"
              dangerouslySetInnerHTML={{ __html: "<div>" + render + "</div>" }}
            ></div>
          </div>
        </div>
      </form>
    </div>
  )
}
