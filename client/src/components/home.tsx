import queryString from "query-string";
import { ResponseType, fetch } from "@tauri-apps/api/http";
import { useEffect, useState } from "react";
import { ApiResponseSearch } from "../../types";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";
import CardHome from "./card-home";
import { Button } from "./ui/button";
import { useLocation, Link } from "react-router-dom";
import NotFound from "./not-found";
import HomeSkeleton from "./skeletons/home-skeleton";
import { baseUrl } from '../constants/url'

export default function Home() {
  const [data, setData] = useState<ApiResponseSearch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let page = queryParams.get("page") || "1";
  let query = queryParams.get("query") || "";

  const pageInt = page ? parseInt(page) : 1;
  const nextPage = pageInt + 1;
  const prevPage = pageInt - 1;
  
  useEffect(() => {
    const url = queryString.stringifyUrl({
      url: `${baseUrl}/api/v1/search`,
      query: {
        q: query,
        sort: "views",
        page: page,
      },
    });
    
    const getInitData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(url, {
          method: "GET",
          timeout: 30,
          responseType: ResponseType.JSON,
        });

        if (response.ok) {
          setData(response.data as ApiResponseSearch);
        } else {
          throw new Error("Gagal mengambil data");
        }
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitData();
  }, [page, query]);

  if (!data || isLoading) {
    return (
      <HomeSkeleton />
    );
  }

  if (data.data.length === 0) {
    return(
      <NotFound />
    )
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-2">
        {data?.data.map((value, index) => (
          <CardHome
            key={`${index}:${value.imageEndpoint}`}
            endpoint={value.imageEndpoint}
            imageUrl={value.previewUrl}
            imageResolution={value.resolution}
            isPNG={value.isPng}
          />
        ))}
      </div>
      <div className="my-2 w-full gap-2 flex justify-center items-center">
        {data.queryDetail.page !== 1 && (
          <Link to={`/search?query=${query}&page=${prevPage}`}>
            <Button>
              <LucideChevronLeft />
            </Button>
          </Link>
        )}
        <Button>{data.queryDetail.page}</Button>
        {data.data.length >= 24 && (
          <Link to={`/search?query=${query}&page=${nextPage}`}>
            <Button>
              <LucideChevronRight />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
