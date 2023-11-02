import { rateLimit } from 'express-rate-limit'

const fifteenMinutes = 15 * 60 * 1000;
export const limiter = rateLimit({
    windowMs: fifteenMinutes,
    limit: 100,
    message: "IP has exceeded the limit of 100 requests, wait 15 minutes",
    standardHeaders: 'draft-7',
    legacyHeaders: false
})