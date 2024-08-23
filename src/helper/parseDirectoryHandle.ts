import { Folder } from "@/types/Folder";

export async function parseDirectoryHandle(
  directoryHandle: FileSystemDirectoryHandle
): Promise<Folder> {
  const folders: Folder[] = [];

  for await (const [name, handle] of (directoryHandle as any).entries()) {
    if (handle.kind === "directory") {
      const subFolder = await parseDirectoryHandle(
        handle as FileSystemDirectoryHandle
      );
      folders.push(subFolder);
    } else if (handle.kind === "file") {
      folders.push({ name });
    }
  }

  return { name: directoryHandle.name, folders };
}
