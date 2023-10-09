import {fetchService} from "../lib/fetch.js";
import * as cheerio from 'cheerio';
import {baseUrl} from "../constant/url.js";


const Services = {
    getSearch: async (req, res) => {
        const page = parseInt(req.query.page);
        const query = req.query.q;
        const category = req.query.categories || "";
        const sorting = req.query.sort || "";

        const categoryArr = category.trim().split(",")
        const categoryArrToLowerCase = categoryArr.map((item) => item.toLowerCase())

        const isGeneral = categoryArrToLowerCase.includes("general")
        const isAnime = categoryArrToLowerCase.includes("anime")
        const isPeople = categoryArrToLowerCase.includes("people")

        const categoryCodex = `${isGeneral ? "1" : "0"}${isAnime ? "1" : "0"}${isPeople ? "1" : "0"}`

        const queryDetail = { page, query, categoryArrToLowerCase, sorting }
        let data = [];
        let url = page || query || categoryArrToLowerCase || sorting
            ? `${baseUrl}/search?q=${query || ""}&page=${page}&categories=${categoryCodex}&sorting=${sorting.toLowerCase()}`
            :`${baseUrl}/search`

        try {
            const response = await fetchService(url, res)
            if (response.status === 200) {
                const $ = cheerio.load(response.data);
                const element = $(".thumb-listing-page")

                let imageEndpoint, previewUrl, resolution, isPng
                element.find("ul > li").each((index, el) => {
                    isPng = $(el).find(".png").text().toLowerCase() === "png"
                    resolution = $(el).find(".wall-res").text()
                    previewUrl = $(el).find("img").attr("data-src")
                    imageEndpoint = $(el).find("a").attr("href").replace("https://wallhaven.cc/w/", "")

                    data.push({
                        isPng,
                        resolution,
                        previewUrl,
                        imageEndpoint
                    })
                })

                res.json({
                    status: true,
                    message: "[GET_API_V1_SEARCH] success",
                    queryDetail,
                    data
                })
            }
        } catch (e) {
            console.log(e)
            res.json({
                status: false,
                message: e
            })
        }
    },
    getDetail: async (req, res) => {
        const imageEndpoint = req.params.imageEndpoint;

        if (!imageEndpoint) {

            res.json({
                status: false,
                message: "imageEndpoint is required"
            })
        }

        const queryDetail = {imageEndpoint}
        let data = [];

        const url = `${baseUrl}/w/${imageEndpoint}`

        try {
            const response = await fetchService(url, res)

            if (response.status === 200) {
                const $ = cheerio.load(response.data)
                const elementSidebar = $("#showcase-sidebar")
                const elementMain = $("#showcase")

                const resolution = elementSidebar.find(".showcase-resolution").text()
                const propertiesText = elementSidebar.find(".sidebar-section > dl").text()

                const parts = propertiesText.split(/Category|Purity|Size|Views|Favorites/g);

                const cleanedParts = parts.map(part => part.trim().replace('-', ''));

                const properties = {
                    uploader: cleanedParts[0],
                    uploaded: cleanedParts[1],
                    category: cleanedParts[2],
                    purity: cleanedParts[3],
                    size: cleanedParts[4],
                    views: cleanedParts[5],
                    favorites: cleanedParts[6]
                };

                const imageUrl = elementMain.find("img").attr("src")
                const targetRemovedText = `${properties.uploaded} ${resolution.replace(" ", "").replace(" ", "")} `;
                const name = elementMain.find("img").attr("alt").replace(targetRemovedText, "");

                data.push({
                    name,
                    resolution,
                    imageUrl,
                    properties
                })

                res.json({
                    status: true,
                    message: "[GET_API_V1_DETAIL]: success",
                    queryDetail,
                    data: data[0]
                })
            }
        } catch (e) {
            console.log(e)
            res.json({
                status: false,
                message: e
            })
        }
    }
}

export default Services