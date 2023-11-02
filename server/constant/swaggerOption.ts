import { SwaggerOptions } from "swagger-ui-express";
import { URL } from "./port.ts";

const swaggerOptions: SwaggerOptions = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Wallhaven API",
            version: "1.0.0",
            description:
                "Wallhaven API - API for search Wallpaper",
            license: {
                name: "MIT",
                url: "https://github.com/RizkyFauziIlmi/wallhaven-API/blob/7067e81cc7a85de3767405ca1167cc56e1c1c854/LICENSE",
            },
            contact: {
                name: "RizkyFauziIlmi",
                url: "https://github.com/RizkyFauziIlmi",
                email: "rizkyfauziilmi@gmail.com",
            },
        },
        servers: [
            {
                url: URL,
            },
            {
                url: ` https://wallhaven-api.vercel.app`,
            },
        ],
    },
    apis: ["./routes/*.js"],
};

export default swaggerOptions