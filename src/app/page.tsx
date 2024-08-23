"use client";
import { Icon } from "@iconify/react";
import Folder from "@/components/Folder";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import parseDirectoryHandle from "@/helper/parseDirectoryHandle";

type Folder = {
  name: string;
  folders?: Folder[];
};

export default function Home() {
  let importedNodes: Folder[] = [];

  const [nodes, setNodes] = useState<Folder[]>(importedNodes);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIsFolder, setNewIsFolder] = useState(true);

  const handleJsonChange = (value: string | undefined) => {
    if (value) {
      try {
        const updatedJson = JSON.parse(value);
        setNodes(updatedJson);
      } catch (error) {
        console.error("Invalid JSON", error);
      }
    }
  };

  const updateFolder = (updatedFolder: Folder) => {
    const updateTree = (nodes: Folder[], updatedFolder: Folder): Folder[] => {
      return nodes.map((folder) => {
        if (folder.name === updatedFolder.name) {
          return updatedFolder;
        }
        if (folder.folders) {
          return {
            ...folder,
            folders: updateTree(folder.folders, updatedFolder),
          };
        }
        return folder;
      });
    };

    setNodes(updateTree(nodes, updatedFolder));
  };

  const handleDelete = (folderName: string) => {
    const deleteNode = (folders: Folder[]): Folder[] => {
      return folders.filter((folder) => {
        if (folder.name === folderName) {
          return false;
        }
        if (folder.folders) {
          folder.folders = deleteNode(folder.folders);
        }
        return true;
      });
    };
    setNodes(deleteNode(nodes));
  };

  const handleDownload = () => {
    if (editorInstance) {
      const json = editorInstance.getValue();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "tree_data.json";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleFolderImport = async () => {
    try {
      const directoryHandle = await (window as any).showDirectoryPicker();
      const folderStructure = await parseDirectoryHandle(directoryHandle);
      setNodes([folderStructure]);
      if (editorInstance) {
        editorInstance.setValue(JSON.stringify([folderStructure], null, 2));
      }
    } catch (error) {
      console.error("Error importing folder:", error);
    }
  };

  const handleAddRootItem = () => {
    if (newName.trim() === "") return;

    const newItem: Folder = newIsFolder
      ? { name: newName, folders: [] }
      : { name: newName };

    setNodes([...nodes, newItem]);

    setIsAdding(false);
    setNewName("");
    setNewIsFolder(true);

    if (editorInstance) {
      editorInstance.setValue(JSON.stringify([...nodes, newItem], null, 2));
    }
  };

  return (
    <main className='flex flex-col h-screen p-10 mb-10'>
      <h1 className='my-2 font-bold'>Tree view example with React JS:</h1>
      <div className='text-xs text-slate-500 mb-4 text-balance bg-slate-200 rounded-xl px-4 py-2'>
        This is a simple tree view example using React JS and recursive logic
        pattern.{" "}
        <span className='italic font-bold'>
          Click on the folder icons to expand/collapse the folders. You can also
          play with the JSON editor to see the changes in the tree view.
        </span>
        <span className='text-red-400 flex flex-row items-center gap-x-2 my-2'>
          <Icon icon='mdi:alert-outline' className='text-xl' />
          <p>
            It is a beta version, the full set of features are not implemented
            yet.
          </p>
        </span>
      </div>

      {/* Add Import and Download Buttons */}
      <div className='flex flex-row gap-x-2 self-end'>
        <button
          className='px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600'
          onClick={handleDownload}
        >
          Download JSON
        </button>
        <button
          className='px-4 py-2 mb-4 text-white bg-green-500 rounded hover:bg-green-600'
          onClick={handleFolderImport}
        >
          Import Folder
        </button>
      </div>

      {/* Add Root Item Button */}
      {nodes.length === 0 && !isAdding && (
        <div className='flex flex-col items-center justify-center min-h-[50px] bg-gray-100 border border-dashed border-gray-300 mb-2'>
          <button
            className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600'
            onClick={() => setIsAdding(true)}
          >
            Add Root Item
          </button>
        </div>
      )}

      {/* Render Input for Adding Root Item */}
      {isAdding && (
        <div className='flex flex-col items-center justify-center min-h-[200px] bg-gray-100 border border-dashed border-gray-300'>
          <div className='flex items-center gap-x-2'>
            <input
              className='border rounded px-2 py-1 text-xs'
              type='text'
              placeholder='New folder or file name'
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <select
              className='text-xs border rounded'
              value={newIsFolder ? "folder" : "file"}
              onChange={(e) => setNewIsFolder(e.target.value === "folder")}
            >
              <option value='folder'>Folder</option>
              <option value='file'>File</option>
            </select>
            <button
              className='text-xs text-green-500 border rounded-full border-slate-300'
              onClick={handleAddRootItem}
            >
              <Icon icon='mdi:check' className='text-xs' />
            </button>
            <button
              className='text-xs text-red-500 border rounded-full border-slate-300'
              onClick={() => setIsAdding(false)}
            >
              <Icon icon='mdi:close' className='text-xs' />
            </button>
          </div>
        </div>
      )}

      {/* Tree View and JSON Editor */}
      <div className='flex flex-col lg:grid lg:grid-cols-2 w-full gap-x-2 gap-y-2 h-[475px]'>
        <ul className='px-6 w-full border overflow-auto min-h-full'>
          {nodes.map((folder) => (
            <Folder
              key={folder.name}
              folder={folder}
              onUpdate={updateFolder}
              onDelete={handleDelete}
            />
          ))}
        </ul>

        <div className='border overflow-auto text-xs text-purple-400 bg-slate-800 min-h-full'>
          <Editor
            height='100%'
            defaultLanguage='json'
            value={JSON.stringify(nodes, null, 2)}
            onChange={handleJsonChange}
            theme='vs-dark'
            onMount={(editor) => setEditorInstance(editor)}
          />
        </div>
      </div>

      <footer className='text-xs text-slate-500 mt-4 w-full text-center flex justify-center items-center'>
        <p>Copyright &copy; Mueen Hossain - 2024</p>
      </footer>
    </main>
  );
}
