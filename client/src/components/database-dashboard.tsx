import { BaseDirectory, FileEntry, readDir } from "@tauri-apps/api/fs";
import Breadcrumb from "./breadcrumb";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button";
import { Link } from "lucide-react";

export default function DatabaseDashboard() {
  const [entriesData, setEntriesData] = useState<FileEntry[]>([]);

  const processEntries = async (entries: FileEntry[]) => {
    let tempEntries: FileEntry[] = [];
    for (const entry of entries) {
      // Add entry to entriesData
      if (entry.name !== "localstorage") {
        tempEntries.push(entry);
        setEntriesData(tempEntries);
  
        if (entry.children) {
          await processEntries(entry.children);
        }
      }
    }
  };

  useEffect(() => {
    const getEntries = async () => {
      const entries = await readDir("", {
        dir: BaseDirectory.AppData,
        recursive: true,
      });
      await processEntries(entries);
    };

    getEntries();
  }, []);

  return (
    <div>
      <Breadcrumb />
      <Table>
        <TableCaption>A list of your recent Wallpaper.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">File Name</TableHead>
            <TableHead>File Path</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entriesData.map((entry, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{entry.name}</TableCell>
              <TableCell>{entry.path}</TableCell>
              <TableCell>
                <a href={`/wallpaper/${entry.name?.replace(/\.(png|jpg)$/i, '')}`}>
                  <Button><Link className="h-4 w-4 mr-2"/> Go to Page</Button>
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}