import queryString from "query-string";
import { ResponseType, fetch } from "@tauri-apps/api/http";
import { useEffect } from "react";
import { ApiResponseSearch } from "../../types";
import { Image } from "lucide-react";
import CardHome from "./card-home";
import { useLocation } from "react-router-dom";
import HomeSkeleton from "./skeletons/home-skeleton";
import { baseUrl } from "../constants/url";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import EndOfContent from "./end-of-content";
import { formatAngka } from "@/lib/string";

export default function Home() {
  const location = useLocation();
  const { ref, inView } = useInView();

  const queryParams = new URLSearchParams(location.search);
  // let page = queryParams.get("page") || 1;
  let query = queryParams.get("q") || "";
  let categories = queryParams.get("categories") || "general,anime";
  let sort = queryParams.get("sort") || "views";
  let aiFilter = queryParams.get("ai_art_filter") || 1;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Animasi pengguliran
    });
  };

  useEffect(() => {
    scrollToTop();
  }, [query, categories, sort, aiFilter]);

  const fetchData = async (page: number) => {
    const url = queryString.stringifyUrl({
      url: `${baseUrl}/api/v1/search`,
      query: {
        q: query,
        sort,
        page,
        categories,
        ai_art_filter: aiFilter,
      },
    });

    const response = await fetch(url, {
      method: "GET",
      responseType: ResponseType.JSON,
    });
    if (!response.ok) {
      throw new Error("Internal Error");
    }
    return response.data as ApiResponseSearch;
  };

  const { data, isSuccess, hasNextPage, fetchNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["home", query, categories, sort, aiFilter],
      queryFn: ({ pageParam }) => fetchData(pageParam as number),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.queryDetail.page + 1,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const isEnd = data?.pages[data.pages.length - 1].data.length === 0;

  return (
    <>
      {isSuccess && data.pages[0].queryDetail.sorting !== "toplist" && (
        <div className="p-5 flex gap-2 items-center">
          <Image />
          <div className="flex flex-col items-start">
            <p className="font-bold text-lg">
              {formatAngka(data.pages[0].queryDetail.totalWallpaper)} Wallpapers
            </p>
            <p className="font-semibold text-sm opacity-50">
              {formatAngka(data.pages[0].queryDetail.totalPages)} pages
            </p>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-2">
          {isSuccess &&
            data.pages.map((page) =>
              page.data.map((value, index) => {
                if (page.data.length === index + 1) {
                  return (
                    <CardHome
                      ref={ref}
                      key={`${index}:${value.imageEndpoint}`}
                      endpoint={value.imageEndpoint}
                      imageUrl={value.previewUrl}
                      imageResolution={value.resolution}
                      isPNG={value.isPng}
                    />
                  );
                }
                return (
                  <CardHome
                    key={`${index}:${value.imageEndpoint}`}
                    endpoint={value.imageEndpoint}
                    imageUrl={value.previewUrl}
                    imageResolution={value.resolution}
                    isPNG={value.isPng}
                  />
                );
              })
            )}
        </div>
        {isFetching && !isEnd && <HomeSkeleton />}
        {isEnd && <EndOfContent />}
      </div>
    </>
  );
}
