import { Menu, MailQuestion, FolderGit2, Github, Bug, FolderClosedIcon, Database } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { open } from "@tauri-apps/api/shell";
import { getName, getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { type } from "@tauri-apps/api/os";
import { invoke } from '@tauri-apps/api'
import { appDataDir } from '@tauri-apps/api/path'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SidebarContent() {
  const [appName, setAppName] = useState("");
  const [appVersion, setAppVersion] = useState("");
  const [tauriVersion, setTauriVersion] = useState("");
  const [osType, setOsType] = useState("");
  const navigate = useNavigate()

  
  useEffect(() => {
    const fetchData = async () => {
      const name = await getName();
      const version = await getVersion();
      const tauriVersion = await getTauriVersion();
      const osType = await type();

      setAppName(name);
      setAppVersion(version);
      setTauriVersion(tauriVersion);
      setOsType(osType);
    };

    fetchData();
  }, []);

  const openGithubProfile = () => {
    open("https://github.com/RizkyFauziIlmi");
  };

  const mailTo = () => {
    open("mailto:rizkyfauziilmi@gmail.com");
  };

  const openIssue = () => {
    open("https://github.com/RizkyFauziIlmi/anywall/issues");
  };

  const openRepository = () => {
    open("https://github.com/RizkyFauziIlmi/anywall/");
  };

  const openDatabaseFolder = async () => {
    const appDataDirPath = await appDataDir();
    invoke("open_folder", { path: `${appDataDirPath}` })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"}>
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="flex flex-col justify-between w-[400px] sm:w-[540px]"> 
        <div className="mt-5">
          <div className="flex flex-col items-start">
            <Button variant={"link"} onClick={openDatabaseFolder}><FolderClosedIcon className="h-4 w-4 mr-2"/>Open Folder in Explorer</Button>
            <a href="/database-dashboard">
              <Button variant={"link"}><Database className="h-4 w-4 mr-2"/>Database Dashboard</Button>
            </a>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>App Info</AccordionTrigger>
              <AccordionContent>
                <table className="mx-auto rounded-lg shadow-lg">
                  <tbody>
                    <tr>
                      <td className="p-4 text-center font-extrabold text-xl" colSpan={2}>
                        <a onClick={() => navigate("/")}>
                          {appName}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4">App Version</td>
                      <td className="p-4">{appVersion}</td>
                    </tr>
                    <tr>
                      <td className="p-4">Tauri Version</td>
                      <td className="p-4">{tauriVersion}</td>
                    </tr>
                    <tr>
                      <td className="p-4">OS</td>
                      <td className="p-4">
                        {osType === "Darwin"
                          ? "MacOS"
                          : osType === "Windows_NT"
                          ? "Windows"
                          : osType}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                found a bug? or want to provide feedback?
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex gap-2">
                  <Button size={"sm"}>
                    <MailQuestion className="h-4 w-4" onClick={mailTo} />
                  </Button>
                  <Button size={"sm"}>
                    <FolderGit2 className="h-4 w-4" onClick={openRepository} />
                  </Button>
                  <Button size={"sm"}>
                    <Github className="h-4 w-4" onClick={openGithubProfile} />
                  </Button>
                  <Button size={"sm"} variant={"destructive"}>
                    <Bug className="h-4 w-4" onClick={openIssue} />
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}