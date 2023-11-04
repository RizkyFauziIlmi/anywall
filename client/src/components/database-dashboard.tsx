import {
  BaseDirectory,
  FileEntry,
  readBinaryFile,
  readDir,
} from "@tauri-apps/api/fs";
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
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { ChevronLeft, FileDigit, Link, Loader2 } from "lucide-react";
import { uint8ArrayToDataUri } from "@/lib/urlAndUint8Array";
import { Progress } from "./ui/progress";
import { useNavigate } from "react-router-dom";

interface ImageData {
  uri: string;
  fileName: string;
}

export default function DatabaseDashboard() {
  const [entriesData, setEntriesData] = useState<FileEntry[]>([]);
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);
  const [readState, setReadState] = useState<string>("");
  const navigate = useNavigate();

  const percentProgress = (counter / entriesData.length) * 100;

  const processEntries = async (entries: FileEntry[]) => {
    setLoading(true);
    let tempEntries: FileEntry[] = [];
    let tempImageData: ImageData[] = [];

    for (const entry of entries) {
      // Add entry to tempEntries
      if (entry.name !== "localstorage") {
        tempEntries.push(entry);
        setEntriesData(tempEntries);

        if (entry.children) {
          await processEntries(entry.children);
        }
      }
    }

    for (const entry of tempEntries) {
      try {
        setReadState(entry.name as string);
        let data = await readBinaryFile(entry.name as string, {
          dir: BaseDirectory.AppData,
        });
        tempImageData.push({
          uri: uint8ArrayToDataUri(data),
          fileName: entry.name as string,
        });
        setCounter(tempImageData.length);
      } catch (error) {
        // Handle error
        console.error("Error reading file:", error);
      }
    }

    // Set both entriesData and imageData at once
    setImageData((prevState) => [...prevState, ...tempImageData]);

    setLoading(false);
  };

  useEffect(() => {
    const getEntries = async () => {
      try {
        const entries = await readDir("", {
          dir: BaseDirectory.AppData,
          recursive: true,
        });
        await processEntries(entries);
      } catch (error) {
        // Handle error
        console.error("Error getting entries:", error);
      }
    };

    getEntries();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <FileDigit className="animate-bounce" size={80} />
        <div className="flex mb-2 items-center">
          <Button onClick={() => navigate(-1)} variant={"ghost"} size={"icon"}>
            <ChevronLeft />
          </Button>
          {counter === 0 ? (
            <p className="animate-pulse font-semibold">Getting entries data</p>
          ) : (
            <p className="animate-pulse font-semibold">
              Load {readState} Binary Image
            </p>
          )}
          <Loader2 className="animate-spin mr-2 ml-1" /> {entriesData.length} /{" "}
          {counter}
        </div>
        <Progress value={percentProgress} className="w-[60%]" />
      </div>
    );
  } else {
    return (
      <div>
        <Breadcrumb />
        <Table>
          <TableCaption>A list of your recent Wallpaper.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>File Path</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entriesData.map((entry, index) => (
              <TableRow key={index}>
                <TableCell className="w-[40%]">
                  <img
                    src={
                      imageData?.filter(
                        (item) => item.fileName === entry.name
                      )[0].uri
                    }
                    alt=""
                  />
                </TableCell>
                <TableCell className="font-medium">{entry.name}</TableCell>
                <TableCell>{entry.path}</TableCell>
                <TableCell>
                  <a
                    href={`/wallpaper/${entry.name?.replace(
                      /\.(png|jpg)$/i,
                      ""
                    )}`}
                  >
                    <Button>
                      <Link className="h-4 w-4 mr-2" /> Go To the Page
                    </Button>
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}
