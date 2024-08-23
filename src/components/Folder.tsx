"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";

type Folder = {
  name: string;
  folders?: Folder[];
};

type FolderProps = {
  folder: Folder;
  onUpdate: (updatedFolder: Folder) => void; // Added onUpdate prop
};

export default function Folder({ folder, onUpdate }: FolderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIsFolder, setNewIsFolder] = useState(true);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const handleAddItem = () => {
    if (newName.trim() === "") return;

    const newItem: Folder = newIsFolder
      ? { name: newName, folders: [] }
      : { name: newName };

    const updatedFolders = [...(folder.folders || []), newItem];
    const updatedFolder = { ...folder, folders: updatedFolders };

    onUpdate(updatedFolder); // Notify parent of the update

    setIsAdding(false);
    setNewName("");
    setNewIsFolder(true);
    setActiveFolder(null); // Reset the active folder after adding
  };

  const handleAddClick = (folderName: string) => {
    setActiveFolder(folderName);
    setIsAdding(true);
  };

  const handleFolderClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li className='my-1 transition-all duration-300' key={folder.name}>
      <span className='flex flex-row items-center text-xs ml-2 gap-x-1.5 bg-slate-100 w-fit pl-2 pr-2 py-1'>
        {folder.folders && folder.folders.length > 0 && (
          <button onClick={handleFolderClick}>
            <Icon
              icon='mdi:chevron-right'
              className={`size-4 text-slate-900 ${isOpen ? "rotate-90" : ""}`}
            />
          </button>
        )}
        {folder.folders ? (
          <Icon
            icon={`${isOpen ? "mdi:folder-open" : "mdi:folder"}`}
            className='text-lg text-blue-500'
          />
        ) : (
          <Icon icon='mdi:file' className='text-lg text-slate-800' />
        )}
        {folder.name}
        {folder.folders && (
          <button
            className='border border-slate-300 rounded-full ml-2'
            onClick={() => handleAddClick(folder.name)}
          >
            <Icon icon='mdi:plus' className='text-xs text-slate-400' />
          </button>
        )}
      </span>

      {isAdding && activeFolder === folder.name && (
        <div className='pl-8 mt-2 flex items-center'>
          <input
            className='border rounded px-2 py-1 text-xs'
            type='text'
            placeholder='New folder or file name'
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <select
            className='ml-2 text-xs border rounded'
            value={newIsFolder ? "folder" : "file"}
            onChange={(e) => setNewIsFolder(e.target.value === "folder")}
          >
            <option value='folder'>Folder</option>
            <option value='file'>File</option>
          </select>
          <button
            className='ml-2 text-xs text-green-500 border rounded-full border-slate-300'
            onClick={handleAddItem}
          >
            <Icon icon='mdi:check' className='text-xs' />
          </button>
          <button
            className='ml-2 text-xs text-red-500 border rounded-full border-slate-300'
            onClick={() => setIsAdding(false)}
          >
            <Icon icon='mdi:close' className='text-xs' />
          </button>
        </div>
      )}

      {isOpen && (
        <ul className='pl-6'>
          {folder.folders?.map((childFolder: Folder) => (
            <Folder
              key={childFolder.name}
              folder={childFolder}
              onUpdate={onUpdate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
