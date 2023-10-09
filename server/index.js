import express from 'express'
import route from "./routes/route.js";
import {limiter} from "./constant/expressRateLimitOption.js";
import morgan from 'morgan'
import cors from 'cors'
import { PORT, URL } from './constant/port.js';


export const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(limiter)

app.use("/api/v1", route)

app.get("/", (req, res) => {
    res.json({
        message: "Please check the documentation",
        endpoint: `${URL}/api/v1`,
        documentation: `${URL}/api/v1/api-docs`
    })
})

app.listen(PORT, "localhost",() => {
    console.log(`Listening to server http://localhost:${PORT}`);
})