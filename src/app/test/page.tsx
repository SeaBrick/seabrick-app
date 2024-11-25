"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import * as ejs from "ejs"
export default function RenderTest() {
  const [activeEditor, setActiveEditor] = useState(false)
  const [template, setTemplate] = useState("")
  // get template for useContext
  // and set it automatically
  const [render, setRender] = useState("<p>Your code Here</p>")

  const router = useRouter()

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
              <button
                className="px-4 py-2 bg-red-600 text-white text-base rounded-[5px] hover:cursor-pointer hover:bg-red-700 active:bg-red-500"
                type="submit"
              >
                Render
              </button>
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
          </div>
        </div>

        <div id="render-area" className="w-full h-full flex gap-4">
          <div
            id="editor-area"
            className={`w-full flex-col rounded-[10px] ${activeEditor ? "flex" : "hidden"}`}
          >
            <div id="input-area" className="flex w-full h-full">
              <textarea
                className="bg-white w-full h-full p-3 rounded-[10px]"
                name="raw"
                placeholder={`This is an HTML Editor, please write everything in plain HTML.
    To add variables, to it in the format: 
                    <%={variable}%>
                  Example:
                    <p>Hello <%=user%>!</p>
                  Expected Output: 
                    Hello John!  
                  Available Variables:
                      - user: The name of the token buyer
                      - date: Today's date
                      - token_id: Token's identifier
                      - address: Destination Address
                      - hash: Transaction Hash'
                      - img_url: Seabrick logo url
Press the "Render" button to visualize your code
                  `}
              ></textarea>
            </div>
            <div id="error-area"></div>
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
// show actual
// open editor
// save? cancel?
// editor: text part / instructions part
// log error part

{
  /* <div>
<textarea
  name=""
  id=""
  onChange={captureText}
  className="bg-white"
></textarea>
<div id="render"></div>
</div> */
}
