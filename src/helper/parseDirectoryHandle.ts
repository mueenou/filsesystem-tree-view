import { Folder } from "@/types/Folder";

export default async function parseDirectoryHandle(
  directoryHandle: FileSystemDirectoryHandle & {
    entries: () => AsyncIterableIterator<[string, FileSystemHandle]>;
  }
): Promise<Folder> {
  const folders: Folder[] = [];
  for await (const [name, handle] of directoryHandle.entries()) {
    if (handle.kind === "directory") {
      const subFolder = await parseDirectoryHandle(handle);
      folders.push(subFolder);
    } else if (handle.kind === "file") {
      folders.push({ name });
    }
  }
  return { name: directoryHandle.name, folders };
}
