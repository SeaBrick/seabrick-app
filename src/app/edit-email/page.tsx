"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import * as ejs from "ejs"
export default function RenderTest() {
  const [activeEditor, setActiveEditor] = useState(false)
  const [activateInstructions, setActivateInstructions] = useState(false)
  const [template, setTemplate] = useState("")
  // get template for useContext
  // and set it automatically
  const [render, setRender] = useState("<p>Your result Here</p>")

  const router = useRouter()

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.altKey && event.key === "r") {
        const renderButton = document.getElementById("render-button")
        renderButton?.click()
      }
    }
    document.addEventListener("keydown", listener)
    return () => {
      document.removeEventListener("keydown", listener)
    }
  }, [])

  function captureText(formData: FormData) {
    const raw = formData.get("raw") as string
    // define variables to be used
    const html = ejs.render(raw, {
      user: "Jhon",
      date: new Date().toLocaleDateString(),
      token_id: 0,
      address: "0x000000000000000000000000000000",
      hash: "1x11111111111111111111111111",
      img_url: "/brick.webp",
    })
    // document.getElementById("render")!.innerHTML = html
    setRender(html)
    setTemplate(raw)
  }

  function saveTemplate() {
    console.log(template) // Este es pa guardar
  }
  return (
    <>
      <form className="h-[65vh] flex flex-col p-4 gap-2" action={captureText}>
        <div className="w-full flex justify-between">
          <div className="w-full flex justify-start gap-2">
            <button
              className="px-4 py-2 text-white text-base rounded-[5px] hover:cursor-pointer bg-seabrick-green active:bg-teal-400 hover:bg-teal-700"
              onClick={saveTemplate}
              type="button"
            >
              Save
            </button>

            <button
              className="px-4 py-2 bg-light-gray text-white text-base rounded-[5px] hover:cursor-pointer hover:bg-gray-600 active:bg-gray-400"
              onClick={() => router.push("/")}
              type="button"
            >
              Go Back
            </button>
          </div>
          <div className="w-full flex justify-end gap-2">
            {activeEditor ? (
              <>
                <span className="self-center mr-2 text-gray-800">
                  Press Alt+R to Render
                </span>
                <button
                  id="render-button"
                  className="px-4 py-2 bg-red-600 text-white text-base rounded-[5px] hover:cursor-pointer hover:bg-red-700 active:bg-red-500"
                  type="submit"
                >
                  Render
                </button>
              </>
            ) : (
              ""
            )}
            <button
              className="px-4 py-2 bg-seabrick-blue text-white text-base rounded-[5px] hover:cursor-pointer hover:bg-blue-600 active:bg-[#4290d6]"
              type="button"
              onClick={() => setActiveEditor(!activeEditor)}
            >
              {activeEditor ? "Close Editor" : "Open Editor"}
            </button>
            <button
              className="px-4 py-2 bg-amber-500 text-white text-base rounded-[5px] hover:cursor-pointer hover:bg-amber-600 active:bg-amber-400"
              type="button"
              onClick={() => setActivateInstructions(!activateInstructions)}
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
            className={`w-full flex-col rounded-[10px] bg-sky-200	text-sky-900 p-4 ${activateInstructions ? "block" : "hidden"}`}
          >
            <p>
              This is an HTML Editor, please write everything in plain HTML.
            </p>
            <p>To add variables, to it in the format:</p>
            <code className="bg-sky-300 p-[1px] rounded-[5px]">{`<%={variable}%>`}</code>
            <p>Example:</p>
            <code className="bg-sky-300 p-[1px] rounded-[5px]">{`<p>Hello <%=user%>!</p>`}</code>
            <p>
              Expected Output:{" "}
              <code className="bg-sky-300 p-[1px] rounded-[5px]">
                Hello John!
              </code>{" "}
            </p>
            <p> Available Variables:</p>
            <p>
              {" "}
              - <code className="bg-sky-300 p-[1px]rounded-[5px]">
                user:
              </code>{" "}
              The name of the token buyer{" "}
            </p>
            <p>
              {" "}
              - <code className="bg-sky-300 p-[1px] rounded-[5px]">
                date:
              </code>{" "}
              {`Today's`} date{" "}
            </p>
            <p>
              {" "}
              -{" "}
              <code className="bg-sky-300 p-[1px] rounded-[5px]">
                token_id:
              </code>{" "}
              {`Token's`} identifier{" "}
            </p>
            <p>
              {" "}
              -{" "}
              <code className="bg-sky-300 p-[1px] rounded-[5px]">
                address:
              </code>{" "}
              Destination Address{" "}
            </p>
            <p>
              {" "}
              - <code className="bg-sky-300 p-[1px] rounded-[5px]">
                hash:
              </code>{" "}
              Transaction Hash{" "}
            </p>
            <p>
              -{" "}
              <code className="bg-sky-300 p-[1px] rounded-[5px]">img_url:</code>{" "}
              Seabrick logo url
            </p>
            <p>Press the {`"Render"`} button to visualize your code</p>
          </div>

          <div
            id="editor-area"
            className={`w-full flex-col rounded-[10px] ${activeEditor ? "flex" : "hidden"}`}
          >
            <div id="input-area" className="flex w-full h-full">
              <textarea
                className="bg-white text-red-700 border-sky-700 border-2 w-full h-full p-3 rounded-[10px]"
                name="raw"
                placeholder={`Your code here`}
              ></textarea>
            </div>
          </div>

          <div
            id="preview-area"
            className={`h-full w-full bg-white rounded-[10px] p-4 overflow-auto`}
          >
            <div
              id="render"
              dangerouslySetInnerHTML={{ __html: "<div>" + render + "</div>" }}
            ></div>
          </div>
        </div>
      </form>
    </>
  )
}
