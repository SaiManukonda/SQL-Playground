import { useState } from "react";

interface NavbarProps {
  onFileSelect: (file: File | null) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onFileSelect }) => {
  const [fileName, setFileName] = useState("Select a database file");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFileName(file.name);
      onFileSelect(file); // Pass file to the parent
    }
  };

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
      <span className="text-lg font-semibold">{fileName}</span>
      <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
        Select File
        <input
          type="file"
          accept=".sql,.db"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
    </nav>
  );
};

export default Navbar;
