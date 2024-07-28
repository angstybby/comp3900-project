import express from "express";
import {
    dbGetRankingBySkip,
    dbGetRankingByZid,
} from "../models/leaderboard.models";
import { CustomRequest } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", async (req, res) => {
    const { skip, search } = req.body;

    try {
        const response = await dbGetRankingBySkip(skip, search);
        console.log("Leaderboard response:", response);
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

router.get("/ranking", async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        return res.status(401).send("Unauthorized");
    }

    const zid = customReq.token.zid;

    try {
        const response = await dbGetRankingByZid(zid);
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

export default router;
