"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Editor from "@monaco-editor/react";
import AvailableTables from "@/components/AvailableTables";

export default function Home() {
  const [leftWidth, setLeftWidth] = useState(0.3); // 30% of total width
  const [topHeightLeft, setTopHeightLeft] = useState(0.5); // 50% of left section
  const [topHeightRight, setTopHeightRight] = useState(0.5); // 50% of right section
  const [editorContent, setEditorContent] = useState("-- Write your SQL here");
  const minFraction = 0.2;
  const maxFraction = 0.8;

  const handleHorizontalResize = (e: React.MouseEvent) => {
    e.preventDefault();
    document.body.style.cursor = "ew-resize";

    const startX = e.clientX;
    const startFraction = leftWidth;
    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = (moveEvent.clientX - startX) / window.innerWidth;
      const newFraction = Math.max(minFraction, Math.min(maxFraction, startFraction + delta));
      setLeftWidth(newFraction);
    };

    const onMouseUp = () => {
      document.body.style.cursor = "default";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleVerticalResize = (
    e: React.MouseEvent,
    setHeight: (h: number) => void,
    startHeight: number
  ) => {
    e.preventDefault();
    document.body.style.cursor = "ns-resize";

    const startY = e.clientY;
    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = (moveEvent.clientY - startY) / window.innerHeight;
      const newFraction = Math.max(minFraction, Math.min(maxFraction, startHeight + delta));
      setHeight(newFraction);
    };

    const onMouseUp = () => {
      document.body.style.cursor = "default";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-grow w-full text-black">
        {/* Left Section */}
        <div style={{ width: `${leftWidth * 100}%` }} className="flex flex-col border-r relative">
          <div style={{ height: `${topHeightLeft * 100}%` }} className="p-2 bg-gray-100 relative">
            <AvailableTables />
            <div
              onMouseDown={(e) => handleVerticalResize(e, setTopHeightLeft, topHeightLeft)}
              className="absolute bottom-0 left-0 w-full h-2 cursor-row-resize bg-gray-300"
            ></div>
          </div>
          <div className="flex-grow p-2 bg-gray-200">Schema Viewer</div>
        </div>

        {/* Horizontal Resizer */}
        <div
          onMouseDown={handleHorizontalResize}
          className="w-2 cursor-col-resize bg-gray-400"
        ></div>

        {/* Right Section */}
        <div className="flex flex-col flex-grow relative">
          <div style={{ height: `${topHeightRight * 100}%` }} className="relative">
            <Editor
              key={leftWidth} // Forces re-render when width changes
              height="100%"
              defaultLanguage="sql"
              value={editorContent} // Controlled value
              onChange={(newValue) => setEditorContent(newValue || "")}
              theme="vs-dark"
              options={{
                automaticLayout: true,
                wordWrap: "on",
                minimap: { enabled: false }
              }} // Ensures dynamic resizing
            />
            <div
              onMouseDown={(e) => handleVerticalResize(e, setTopHeightRight, topHeightRight)}
              className="absolute bottom-0 left-0 w-full h-2 cursor-row-resize bg-gray-300"
            ></div>
          </div>
          <div className="flex-grow p-2 bg-gray-200">SQL Output</div>
        </div>
      </div>
    </div>
  );
}
