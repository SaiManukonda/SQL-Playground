import {useEffect, useState } from 'react'
import Editor from "@monaco-editor/react";
import initSqlJs, { Database } from "sql.js";
import Navbar from './components/Navbar';
import AvailableTables from "./components/AvailableTables.tsx";

interface TableRow {
  [key: string]: string | number | null;
}

function App() {
  const [db, setDb] = useState<Database | null>(null); // SQLite database
  const [file, setFile] = useState<File | null>(null);
  const [leftWidth, setLeftWidth] = useState(0.3); // 30% of total width
  const [topHeightLeft, setTopHeightLeft] = useState(0.5); // 50% of left section
  const [topHeightRight, setTopHeightRight] = useState(0.5); // 50% of right section
  const [maxHeightLeft, setMaxHeightLeft] = useState(topHeightLeft * window.innerHeight);
  const [maxHeightRight, setMaxHeightRight] = useState(topHeightRight * window.innerHeight);
  const [editorContent, setEditorContent] = useState("-- Write your SQL here");
  const [tables, setTables] = useState<Record<string, TableRow[]>>({});
  const minFraction = 0.2;
  const maxFraction = 0.8;

  useEffect(() => {
    const loadSqlJs = async () => {
      const SQL = await initSqlJs({ locateFile: () => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/sql-wasm.wasm" });
      if (file) {
        // Read file as ArrayBuffer
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const uint8Array = new Uint8Array(event.target.result as ArrayBuffer);
            setDb(new SQL.Database(uint8Array)); // Load the database from file
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        setDb(new SQL.Database()); // Empty in-memory DB
      }
    };
    loadSqlJs();
  }, [file]);

  useEffect(() => {
    if (db) fetchTables();
  }, [db]);
  
  console.log(maxHeightRight);
  const fetchTables = () => {
    if (!db) return;
    try {
      const tableQuery = db.exec("SELECT name FROM sqlite_master WHERE type='table';");
  
      // Ensure values exist and filter out non-string table names
      const tableNames = tableQuery[0]?.values.map((row) => row[0] as string) || [];
  
      const tableData: Record<string, TableRow[]> = {};
  
      tableNames.forEach((table: string) => {
        const result = db.exec(`SELECT * FROM "${table}";`); // Use quotes to avoid reserved words issue
        if (result.length > 0) {
          const columns = result[0].columns;
          const values = result[0].values;
          tableData[table] = values.map(row => Object.fromEntries(columns.map((col, i) => [col, convertSqlValue(row[i])])));
        } else {
          tableData[table] = [];
        }
      });
  
      setTables(tableData);
    } catch (err) {
      console.error("Error fetching tables:", err);
    }
  };
  
  // Function to safely convert SQL values
  const convertSqlValue = (value: string | number | null | Uint8Array): string | number | null => {
    if (value instanceof Uint8Array) {
      return new TextDecoder().decode(value); // Convert binary data to string
    }
    return value;
  };
  

  const executeQuery = () => {
    if (!db) return;
    try {
      const result = db.exec(editorContent);
      console.log("Query Result:", result);
      fetchTables(); // Refresh tables after running a query
    } catch (err) {
      console.error("SQL Execution Error:", err);
    }
  };
  
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
    startHeight: number,
    setMaxHeight: (h: number) => void // Add this new setter
  ) => {
    e.preventDefault();
    document.body.style.cursor = "ns-resize";
  
    const startY = e.clientY;
    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = (moveEvent.clientY - startY) / window.innerHeight;
      const newFraction = Math.max(minFraction, Math.min(maxFraction, startHeight + delta));
  
      setHeight(newFraction);
      setMaxHeight(newFraction * window.innerHeight); // Update maxHeight dynamically
    };
  
    const onMouseUp = () => {
      document.body.style.cursor = "default";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onFileSelect={setFile} />
      <div className="flex flex-grow w-full text-black">
        {/* Left Section */}
        <div style={{ width: `${leftWidth * 100}%` }} className="flex flex-col border-r relative">
          <div style={{ height: `${topHeightLeft * 100}%` }} className="p-2 bg-gray-100 overflow-hidden flex flex-col">
            <AvailableTables tables={tables} maxHeight={maxHeightLeft * 0.80} />
          </div>
          
          {/* Resizer between the two sections */}
          <div
            onMouseDown={(e) => handleVerticalResize(e, setTopHeightLeft, topHeightLeft, setMaxHeightLeft)}
            className="h-2 cursor-row-resize bg-gray-300"
          ></div>
          
          {/* Schema Viewer now properly below the resizer */}
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
            <button onClick={executeQuery} className="absolute bottom-2 right-2 p-2 bg-blue-500 text-white rounded">
              Run SQL
            </button>
            <div
              onMouseDown={(e) => handleVerticalResize(e, setTopHeightRight, topHeightRight, setMaxHeightRight)}
              className="absolute left-0 w-full h-2 cursor-row-resize bg-gray-300"
            ></div>
          </div>
          <div className="flex-grow p-2 bg-gray-200">SQL Output</div>
        </div>
      </div>
    </div>
  );
}

export default App
