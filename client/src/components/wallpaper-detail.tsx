import { useParams } from "react-router";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { ApiResponseWallpaper } from "../../types";
import { ResponseType, fetch } from "@tauri-apps/api/http";
import {
  ChevronLeft,
  DownloadCloud,
  FolderCheckIcon,
  Loader2,
  Presentation,
  Trash,
  Wallpaper,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  writeBinaryFile,
  BaseDirectory,
  exists,
  removeFile,
} from "@tauri-apps/api/fs";
import { urlToUint8Array } from "@/lib/urlAndUint8Array";
import { getFileExtension } from "@/lib/getFileExtension";
import { confirm, message } from "@tauri-apps/api/dialog";
import Breadcrumb from "./breadcrumb";
import {
  sendNotification,
  isPermissionGranted,
  requestPermission,
} from "@tauri-apps/api/notification";
import { invoke } from "@tauri-apps/api";
import { appDataDir } from "@tauri-apps/api/path";
import AppLayout from "./layout/AppLayout";
import WallpaperSkeleton from "./skeletons/wallpaper-skeleton";
import { useNavigate } from "react-router-dom";
import { appWindow } from "@tauri-apps/api/window";
import { cn } from "@/lib/utils";
import { baseUrl } from "@/constants/url";
import { useQuery } from "@tanstack/react-query";
import NotFound from "./not-found";

export default function WallpaperDetail() {
  const bottomRef = useRef<null | HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isDownloaded, setIsDownloaded] = useState<boolean | null>(null);
  const [isImageFullscreen, setIsImageFullscreen] = useState<
    boolean | undefined
  >(undefined);
  let { endpoint } = useParams();
  const navigate = useNavigate();
  const isDownloading = isLoading === "downloading";
  const isSettingWallpaper = isLoading === "setting";
  const isRemoving = isLoading === "removing";

  const url = queryString.stringifyUrl({
    url: `${baseUrl}/api/v1/wallpaper/${endpoint}`,
  });

  const fetchData = async () => {
    const response = await fetch(url, {
      method: "GET",
      responseType: ResponseType.JSON,
    });
    if (!response.ok) {
      throw new Error("Internal Error");
    }
    return response.data as ApiResponseWallpaper;
  };

  const { isPending, error, data } = useQuery({
    queryKey: ["wallpaper", endpoint],
    queryFn: () => fetchData(),
  });

  const setPreview = async () => {
    const isFullscreen = await appWindow.isFullscreen();
    if (isFullscreen) {
      await appWindow.setFullscreen(false);
      setIsImageFullscreen(false);
    } else {
      await appWindow.setFullscreen(true);
      setIsImageFullscreen(true);
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getFileNameAndExtension = (imageUrl: string, imageEndpoint: string) => {
    const extension = getFileExtension(imageUrl);
    const fileName = `${imageEndpoint}.${extension}`;
    return { fileName, extension };
  };

  const downloadPhoto = async () => {
    if (!data) return;

    const { imageUrl } = data.data;
    const { imageEndpoint } = data.queryDetail;
    const { fileName } = getFileNameAndExtension(imageUrl, imageEndpoint);

    try {
      const isExist = await exists(fileName, { dir: BaseDirectory.AppData });

      if (isExist) {
        await message("Remove photo from app data folder", {
          title: "Photo already exists",
          type: "warning",
        });
      } else {
        setIsLoading("downloading");
        const uint8Array = await urlToUint8Array(imageUrl);
        await writeBinaryFile(
          { path: fileName, contents: uint8Array },
          { dir: BaseDirectory.AppData }
        );

        let permissionGranted = await isPermissionGranted();
        if (!permissionGranted) {
          const permission = await requestPermission();
          permissionGranted = permission === "granted";
        }
        if (permissionGranted) {
          sendNotification({
            body: `${fileName} downloaded`,
            title: "Success",
          });
        }

        await message("the downloaded file is in the app data directory", {
          title: "Photo Downloaded Successfully",
          type: "info",
        });
        setIsLoading(null);
      }
    } catch (error) {
      await message(error as string, {
        title: "Error while downloading photo",
        type: "error",
      });
      setIsLoading(null);
    }
  };

  const setAsWallpaper = async () => {
    if (!data) return;

    setIsLoading("setting");
    const { imageUrl } = data.data;
    const { imageEndpoint } = data.queryDetail;
    const { fileName } = getFileNameAndExtension(imageUrl, imageEndpoint);

    const isExist = await exists(fileName, { dir: BaseDirectory.AppData });

    if (!isExist) {
      await downloadPhoto();
    }

    const appDataDirPath = await appDataDir();
    invoke("set_wallpaper", { path: `${appDataDirPath}${fileName}` })
      .then(() => {
        (async function () {
          await message(`${fileName} was successfully set`, {
            title: "Wallpaper changed successfully",
            type: "info",
          });
        })();
        setIsLoading(null);
      })
      .catch((error) => {
        (async function () {
          await message(error, {
            title: "Error while setting photo",
            type: "error",
          });
        })();
        setIsLoading(null);
      });
  };

  const removePhoto = async () => {
    if (!isDownloaded || !data) return;

    const { imageUrl } = data.data;
    const { imageEndpoint } = data.queryDetail;
    const { fileName } = getFileNameAndExtension(imageUrl, imageEndpoint);

    const confirmed = await confirm(
      `${fileName} will removed from your device, are you sure?`,
      { title: "Delete photo", type: "info" }
    );

    if (confirmed) {
      setIsLoading("removing");
      await removeFile(fileName, { dir: BaseDirectory.AppData })
        .then(async () => {
          await message(`${fileName} is now remove from your device`, {
            title: "Photo Removed Successfully",
            type: "info",
          });
          setIsLoading(null);
        })
        .catch(async (error) => {
          await message(error as string, {
            title: "Error while removing photo",
            type: "error",
          });
          setIsLoading(null);
        });
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isImageFullscreen]);

  useEffect(() => {
    const keyDownHandler = async (event: KeyboardEvent) => {
      event.preventDefault();

      if (event.key === "Escape") {
        await appWindow.setFullscreen(false);
        setIsImageFullscreen(false);
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  if (isPending) {
    return <WallpaperSkeleton />;
  }

  if (error) {
    return <NotFound />;
  }

  if (data) {
    const initStatus = async () => {
      const { imageUrl } = data.data;
      const { imageEndpoint } = data.queryDetail;
      const extension = getFileExtension(imageUrl);
      const fileName = `${imageEndpoint}.${extension}`;
      const isExist = await exists(fileName, { dir: BaseDirectory.AppData });
      setIsDownloaded(isExist);
    };
    initStatus();
  }

  return (
    <AppLayout isFullscreen={isImageFullscreen} isSearch={false}>
      <div className="relative flex flex-col justify-center items-center py-2 min-h-screen px-5">
        <Breadcrumb />
        <img
          src={data.data.imageUrl}
          className={cn(
            "rounded-sm w-3/4",
            isImageFullscreen
              ? "absolute top-0 left-0 right-0 bottom-0 w-auto"
              : ""
          )}
          alt={data.data.name}
        />
        <p className="font-semibold text-sm text-center pt-2">
          {data.data.name}
        </p>
        <div
          className={cn("flex w-full gap-2 justify-center items-center pt-4")}
        >
          <Button onClick={() => navigate(-1)}>
            <ChevronLeft />
          </Button>
          <Button
            variant={"ghost"}
            disabled={isDownloading}
            onClick={downloadPhoto}
          >
            {isDownloading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : isDownloaded ? (
              <FolderCheckIcon className="h-4 w-4 mr-2" />
            ) : (
              <DownloadCloud className="h-4 w-4 mr-2" />
            )}
            {isDownloading
              ? "Downloading..."
              : isDownloaded
              ? "Downloaded"
              : "Download"}
          </Button>
          <Button
            onClick={setAsWallpaper}
            disabled={isSettingWallpaper}
            variant={"ghost"}
          >
            {isSettingWallpaper ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <Wallpaper className="h-4 w-4 mr-2" />
            )}
            {isSettingWallpaper ? "setting..." : "Set as Wallpaper"}
          </Button>
          <Button onClick={setPreview} variant={"ghost"}>
            <Presentation className="h-4 w-4 mr-2" />
            Preview
          </Button>
          {isDownloaded && (
            <Button
              disabled={isRemoving}
              variant={"destructive"}
              onClick={removePhoto}
            >
              {isRemoving ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <Trash className="h-4 w-4 mr-2" />
              )}
              {isRemoving ? "removing..." : "Remove File"}
            </Button>
          )}
        </div>
        <div
          className={cn(
            "absolute bottom-2 left-2 z-50 font-semibold text-orange-300",
            isImageFullscreen ? "" : "hidden"
          )}
        >
          Press Escape to Exit Fullscreen
        </div>
      </div>
      <div ref={bottomRef} />
    </AppLayout>
  );
}
