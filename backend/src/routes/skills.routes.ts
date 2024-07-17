import express, { Request, Response } from "express";
import {
    dbGenerateGapAnalysis,
    dbGetSkills,
    dbSearchSkillByName,
} from "../models/skills.models";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const result = await dbGetSkills();
        res.status(200).send(result);
    } catch (error) {
        console.error("Error in /skill:", error);
        res.status(500).send("An error occurred while getting skills");
    }
});

/**
 * @route GET /skill/search
 * @desc Get the first 10 skills matching the search query
 * @access Private
 * @returns {Array} Array of skills
 * @returns {String} Error message
 * @throws {200} If skills are successfully retrieved
 * @throws {500} If an error occurs while getting skills
 */
router.post("/search", async (req, res) => {
    const { skillName } = req.body;

    try {
        const result = await dbSearchSkillByName(skillName);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error in /skill:", error);
        res.status(500).send("An error occurred while getting skills");
    }
});

router.post("/gap-analysis", async (req, res) => {
    const { groupId, projectId } = req.body;

    try {
        const result = await dbGenerateGapAnalysis(groupId, projectId);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error in /skill/gap-analysis:", error);
        res.status(500).send("An error occurred while generating gap analysis");
    }
});

export default router;
