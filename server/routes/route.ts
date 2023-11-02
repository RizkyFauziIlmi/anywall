import { Router } from "express";
import Services from "../controllers/services.ts";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerOptions from "../constant/swaggerOption.ts";
const route = Router()

const specs = swaggerJsdoc(swaggerOptions);
route.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs ));

route.get("/", (req, res) => {
    res.json({message: "success"})
})

/**
 * @swagger
 * /api/v1/search:
 *   get:
 *     summary: Get search results from Wallhaven.cc
 *     description: Retrieve search results based on specified parameters.
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number for pagination. (1 - ...)
 *         schema:
 *           type: integer
 *       - in: query
 *         name: q
 *         description: Search query. (any)
 *         schema:
 *           type: string
 *       - in: query
 *         name: categories
 *         description: Comma-separated list of categories. (general,anime,people)
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         description: Sorting order for the results. PICK ONE! (relevance | random | date_added | views | favorites | toplist | hot)
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with search results.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 queryDetail:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       page:
 *                         type: integer
 *                       query:
 *                         type: string
 *                       categoryArrToLowerCase:
 *                         type: array
 *                         items:
 *                           type: string
 *                       sorting:
 *                         type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       isPng:
 *                         type: boolean
 *                       resolution:
 *                         type: string
 *                       previewUrl:
 *                         type: string
 *                       imageEndpoint:
 *                         type: string
 *     security: []
 */
route.get("/search", Services.getSearch)
/**
 * @swagger
 * /api/v1/wallpaper/{imageEndpoint}:
 *   get:
 *     summary: Get details of a Wallhaven.cc image.
 *     description: Retrieve detailed information about a specific image.
 *     parameters:
 *       - in: path
 *         name: imageEndpoint
 *         description: Unique identifier for the image.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with image details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 queryDetail:
 *                   type: object
 *                   properties:
 *                     imageEndpoint:
 *                       type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       resolution:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       properties:
 *                         type: object
 *                         properties:
 *                           uploader:
 *                             type: string
 *                           uploaded:
 *                             type: string
 *                           category:
 *                             type: string
 *                           purity:
 *                             type: string
 *                           size:
 *                             type: string
 *                           views:
 *                             type: string
 *                           favorites:
 *                             type: string
 *     security: []
 */
route.get("/wallpaper/:imageEndpoint", Services.getDetail)
export default route

