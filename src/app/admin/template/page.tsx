"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import * as ejs from "ejs";
export default function RenderTest() {
  const [activeEditor, setActiveEditor] = useState(false);
  const [activateInstructions, setActivateInstructions] = useState(true);
  const [template, setTemplate] = useState("");
  // get template for useContext
  // and set it automatically
  const [render, setRender] = useState("<p>Your result Here</p>");

  const router = useRouter();

  const variables = {
    email: "The email of the token buyer",
    tokenIds: "The IDs of the token obtained",
    date: "Date of the buy",
    txHash:
      "The blockchain transaction hash that verified the creation of the tokens",
    logoUrl: "The Seabrick logo URL",
  };

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.altKey && event.key === "r") {
        const renderButton = document.getElementById("render-button");
        renderButton?.click();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  function captureText(formData: FormData) {
    const raw = formData.get("raw") as string;
    // define variables to be used
    const html = ejs.render(raw, {
      user: "Jhon",
      date: new Date().toLocaleDateString(),
      token_id: 0,
      address: "0x000000000000000000000000000000",
      hash: "1x11111111111111111111111111",
      img_url: "/brick.webp",
    });
    // document.getElementById("render")!.innerHTML = html
    setRender(html);
    setTemplate(raw);
  }

  function saveTemplate() {
    console.log(template); // Este es pa guardar
  }
  return (
    <div>
      <form className="h-[65vh] flex flex-col p-4 gap-2" action={captureText}>
        <div className="w-full flex justify-between">
          <div className="w-full flex justify-start gap-2">
            <button
              className="px-4 py-2 text-white text-base rounded-md hover:cursor-pointer bg-seabrick-green active:bg-teal-400 hover:bg-teal-700"
              onClick={saveTemplate}
              type="button"
            >
              Save
            </button>

            <button
              className="px-4 py-2 bg-light-gray text-white text-base rounded-md hover:cursor-pointer hover:bg-gray-600 active:bg-gray-400"
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
                  className="px-4 py-2 bg-red-600 text-white text-base rounded-md hover:cursor-pointer hover:bg-red-700 active:bg-red-500"
                  type="submit"
                >
                  Render
                </button>
              </>
            ) : (
              ""
            )}
            <button
              className="px-4 py-2 bg-seabrick-blue text-white text-base rounded-md hover:cursor-pointer hover:bg-blue-600 active:bg-[#4290d6]"
              type="button"
              onClick={() => setActiveEditor(!activeEditor)}
            >
              {activeEditor ? "Close Editor" : "Open Editor"}
            </button>
            <button
              className="px-4 py-2 bg-amber-500 text-white text-base rounded-md hover:cursor-pointer hover:bg-amber-600 active:bg-amber-400"
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
              <code className="bg-gray-200 p-4 rounded-md">{`<p>Hello <%=user%>!</p>`}</code>
            </p>

            <p className="flex flex-col">
              <span>Expected Output:</span>
              <code className="bg-gray-200 p-5 rounded-md">Hello John!</code>
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
                  );
                })}
              </ul>
            </div>

            <p>
              Press the{" "}
              <span className="bg-red-300 p-1 rounded-md">Render</span> button
              to visualize your code.
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
                placeholder={`Your code here`}
              ></textarea>
            </div>
          </div>

          <div
            id="preview-area"
            className={`h-full w-full bg-white rounded-xl p-4 overflow-auto border-2 border-seabrick-green`}
          >
            <div
              id="render"
              dangerouslySetInnerHTML={{ __html: "<div>" + render + "</div>" }}
            ></div>
          </div>
        </div>
      </form>
    </div>
  );
}
