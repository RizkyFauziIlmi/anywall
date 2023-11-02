import axios, { AxiosResponse } from "axios";
import { Response } from "express";

export const fetchService = async (url: string, res: Response): Promise<AxiosResponse> => {
    try {
        const response = await axios(url)
        return new Promise((resolve, reject) => {
            if (response.status === 200) resolve(response)
            reject(response)
        })
    } catch (error) {
        res.send({
            status: false,
            code: 404,
            message: "Bad Request"
        })
        throw error
    }
}