"use client";
import { Icon } from "@iconify/react";
import Folder from "@/components/Folder";
import { useState } from "react";
import Editor from "@monaco-editor/react";

type Folder = {
  name: string;
  folders?: Folder[];
};

export default function Home() {
  let importedNodes: Folder[] = [
    {
      name: "Home",
      folders: [
        {
          name: "Movies",
          folders: [
            {
              name: "Action",
              folders: [
                {
                  name: "Superhero",
                  folders: [
                    {
                      name: "Marvel",
                      folders: [
                        {
                          name: "Spiderman.mp4",
                        },
                      ],
                    },
                    {
                      name: "DC",
                      folders: [{ name: "The Batman.mp4" }],
                    },
                  ],
                },
                { name: "Martial Arts", folders: [] },
              ],
            },
            {
              name: "Comedy",
              folders: [],
            },
            {
              name: "Drama",
              folders: [
                { name: "Courtroom", folders: [] },
                { name: "Thriller", folders: [] },
              ],
            },
          ],
        },
        {
          name: "Music",
          folders: [
            { name: "Rock", folders: [] },
            { name: "Pop", folders: [] },
            { name: "Jazz", folders: [] },
          ],
        },
        {
          name: "Pictures",
          folders: [],
        },
        {
          name: "Documents",
          folders: [
            {
              name: "Work",
              folders: [
                {
                  name: "Invoices",
                  folders: [
                    { name: "Invoice 1.pdf" },
                    { name: "Invoice 2.pdf" },
                  ],
                },
              ],
            },
            {
              name: "Personal",
              folders: [
                {
                  name: "Letters",
                  folders: [
                    { name: "Letter to Mom.docx" },
                    { name: "Letter to Dad.docx" },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "passwords.txt",
        },
      ],
    },
  ];

  const [nodes, setNodes] = useState<Folder[]>(importedNodes);

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

  return (
    <main className='flex flex-col h-screen p-10 mb-10'>
      <h1 className='my-2 font-bold'>Tree view example with React JS:</h1>
      <div className='text-xs text-slate-500 mb-4 text-balance bg-slate-200 rounded-xl px-4 py-2'>
        This is a simple tree view example using React JS and recursive logic
        pattern.{" "}
        <span className='italic font-bold'>
          Click on the folder icons to expand/collapse the folders.You can also
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
      <div className='grid grid-cols-2 w-full gap-x-2 h-[475px]'>
        <ul className='px-6 w-full border overflow-auto'>
          {nodes.map((folder) => (
            <Folder key={folder.name} folder={folder} onUpdate={updateFolder} />
          ))}
        </ul>

        <div className='border overflow-auto text-xs text-purple-400 bg-slate-800'>
          <Editor
            height='100%'
            defaultLanguage='json'
            value={JSON.stringify(nodes, null, 2)}
            onChange={handleJsonChange}
            theme='vs-dark'
          />
        </div>
      </div>
      <footer className='text-xs text-slate-500 mt-4 w-full text-center flex justify-center items-center'>
        <p>Copyright &copy; Mueen Hossain - 2024</p>
      </footer>
    </main>
  );
}
