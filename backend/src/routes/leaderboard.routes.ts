import express from "express";
import {
    dbGetAllRankings,
    dbGetRankingByZid,
} from "../models/leaderboard.models";
import { CustomRequest } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const response = await dbGetAllRankings();
        // format response
        const formattedResponse = response.map((profile, index) => {
            return {
                rank: index + 1,
                zid: profile.zid,
                fullname: profile.fullname,
                skillCount: profile._count.Skills,
            };
        });
        console.log("Leaderboard response:", formattedResponse);
        res.status(200).send(formattedResponse);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

export default router;
