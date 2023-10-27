import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from 'react-router-dom';
import WallpaperDetail from "./components/wallpaper-detail";
import { ThemeProvider } from "./components/theme-provider";
import DatabaseDashboard from "./components/database-dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/search",
    element: <App />
  },
  {
    path: "/wallpaper",
    element: <Navigate to={"/"} />
  },
  {
    path: "/database-dashboard",
    element: <DatabaseDashboard />
  },
  {
    path: "/wallpaper/:endpoint",
    element: <WallpaperDetail />
  }
])

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
    </ThemeProvider>
  </QueryClientProvider>,
);
