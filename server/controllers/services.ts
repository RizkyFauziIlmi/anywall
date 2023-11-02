import { fetchService } from "../lib/fetch.ts";
import * as cheerio from "cheerio";
import { baseUrl } from "../constant/url.ts";
import queryString from "query-string";
import { extractNumbers } from "../lib/string.ts";
import { Response, Request } from "express";
import {
  QueryParametersSearch,
  QueryDetailSearch,
  WallpaperDataSearch,
  QueryDetailWallpaper,
  WallpaperDetail,
  WallpaperProperties,
} from "../types.ts";

const Services = {
  getSearch: async (req: Request, res: Response) => {
    const queryParams: QueryParametersSearch = {
      page: parseInt(req.query.page as string) || 1,
      q: (req.query.q as string) || undefined,
      categories: (req.query.categories as string) || undefined,
      sort: (req.query.sort as string) || undefined,
      ai_art_filter: (req.query.ai_art_filter as string) || undefined,
    };

    const categoryArr = queryParams.categories?.trim().split(",");
    const categoryArrToLowerCase = categoryArr?.map((item) =>
      item.toLowerCase()
    );

    const isGeneral = categoryArrToLowerCase?.includes("general");
    const isAnime = categoryArrToLowerCase?.includes("anime");
    const isPeople = categoryArrToLowerCase?.includes("people");

    const categoryCodex = `${isGeneral ? "1" : "0"}${isAnime ? "1" : "0"}${
      isPeople ? "1" : "0"
    }`;

    let queryDetail: QueryDetailSearch = {
      page: queryParams.page,
      query: queryParams.q,
      categoryArrToLowerCase,
      sorting: queryParams.sort,
    };

    let data: WallpaperDataSearch[] = [];

    let url = queryString.stringifyUrl({
      url: `${baseUrl}/search`,
      query: {
        q: queryParams.q,
        page: queryParams.page,
        categories: categoryCodex === "000" ? undefined : categoryCodex,
        sorting: queryParams.sort?.toLowerCase(),
        ai_art_filter: queryParams.ai_art_filter,
      },
    });

    try {
      const response = await fetchService(url, res);
      if (response.status === 200) {
        const $ = cheerio.load(response.data);
        const element = $(".thumb-listing-page");

        let imageEndpoint: string | undefined,
          previewUrl: string | undefined,
          resolution: string,
          isPng: boolean,
          totalWallpaper: number,
          totalPages: number;

        totalWallpaper = extractNumbers(
          $(".listing-header").find("h1").text()
        )[0];
        totalPages = Math.ceil(totalWallpaper / 23);
        queryDetail = { ...queryDetail, totalWallpaper, totalPages };

        element.find("ul > li").each((index, el) => {
          isPng = $(el).find(".png").text().toLowerCase() === "png";
          resolution = $(el).find(".wall-res").text();
          previewUrl = $(el).find("img").attr("data-src");
          imageEndpoint = $(el)
            ?.find("a")
            ?.attr("href")
            ?.replace("https://wallhaven.cc/w/", "");

          data.push({
            isPng,
            resolution,
            previewUrl,
            imageEndpoint,
          });
        });

        res.status(200).json({
          status: true,
          message: "[GET_API_V1_SEARCH] success",
          queryDetail,
          data,
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        status: false,
        message: e,
      });
    }
  },
  getDetail: async (req: Request, res: Response) => {
    const imageEndpoint: string | undefined = req.params.imageEndpoint;

    if (!imageEndpoint) {
      res.status(400).json({
        status: false,
        message: "imageEndpoint is required",
      });
    }

    const queryDetail: QueryDetailWallpaper = { imageEndpoint };
    let data: WallpaperDetail[] = [];

    const url = `${baseUrl}/w/${imageEndpoint}`;

    try {
      const response = await fetchService(url, res);

      if (response.status === 200) {
        const $ = cheerio.load(response.data);
        const elementSidebar = $("#showcase-sidebar");
        const elementMain = $("#showcase");

        const resolution: string = elementSidebar
          .find(".showcase-resolution")
          .text();
        const propertiesText: string = elementSidebar
          .find(".sidebar-section > dl")
          .text();

        const parts: string[] = propertiesText.split(
          /Category|Purity|Size|Views|Favorites/g
        );

        const cleanedParts: string[] = parts.map((part) =>
          part.trim().replace("-", "")
        );

        const properties: WallpaperProperties = {
          uploader: cleanedParts[0],
          uploaded: cleanedParts[1],
          category: cleanedParts[2],
          purity: cleanedParts[3],
          size: cleanedParts[4],
          views: cleanedParts[5],
          favorites: cleanedParts[6],
        };

        const imageUrl: string | undefined = elementMain
          .find("img")
          .attr("src");
        const targetRemovedText: string = `${properties.uploaded} ${resolution
          .replace(" ", "")
          .replace(" ", "")} `;
        const name = elementMain
          ?.find("img")
          ?.attr("alt")
          ?.replace(targetRemovedText, "");

        data.push({
          name,
          resolution,
          imageUrl,
          properties,
        });

        res.status(200).json({
          status: true,
          message: "[GET_API_V1_DETAIL]: success",
          queryDetail,
          data: data[0],
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        status: false,
        message: e,
      });
    }
  },
};

export default Services;
