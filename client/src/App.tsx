import { useEffect } from "react";
import "./App.css";
import Home from "./components/home";
import AppLayout from "./components/layout/AppLayout";
import { BaseDirectory, createDir } from "@tauri-apps/api/fs";

function App() {
  useEffect(() => {
      // * IMPORTANT: Do not remove otherwise is not be working on windows
      const initAppData = async () => {
        await createDir('', { dir: BaseDirectory.AppData, recursive: true });
      }

      initAppData()
  }, [])

  return (
    <AppLayout>
      <Home />
    </AppLayout>
  );
}

export default App;
