import express from "express";
import {
    dbGetAllRankings,
} from "../models/leaderboard.models";
import { authMiddleWare, CustomRequest } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * Route to get all rankings.
 * @route POST /
 * @returns {Object[]} An array of ranking objects.
 * @throws {Error} If there is an error retrieving the rankings.
 */
router.post("/", authMiddleWare, async (req, res) => {
    try {
        const customReq = req as CustomRequest;
        if (!customReq.token || typeof customReq.token === "string") {
            throw new Error("Token is not valid");
        }
        
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
