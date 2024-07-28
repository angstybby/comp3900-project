import express, { Request, Response } from "express";
import {
    dbGenerateGapAnalysis,
    dbGetSkills,
    dbSearchSkillByName,
} from "../models/skills.models";
import { CustomRequest } from "../middleware/auth.middleware";
import { dbGetProfile, dbGetStudentProfiles, getUserType } from "../models/profile.models";

const router = express.Router();

/**
 * @route GET /skill
 * @desc Get all skills
 * @access Private
 * @returns {Array} Array of skills
 * @returns {String} Error message
 * @throws {200} If skills are successfully retrieved
 * @throws {500} If an error occurs while getting skills
 */
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

/**
 * @route POST /skill/gap-analysis
 * @desc Generate gap analysis for a project
 * @access Private
 * @returns {Array} Gap analysis
 * @returns {String} Error message
 * @throws {200} If gap analysis is successfully generated
 * @throws {500} If an error occurs while generating gap analysis
 */
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

interface ProfileSimple {
    zid: string;
    Skills: {
        skillName: string;
    }[];
}

router.get("/leaderboard-data", async (req: Request, res: Response) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    try {
        const skills = await dbGetSkills();
        const length = skills.length;
    
        const dataset: { [key: string]: number } = {};
        for (let i = 0; i <= length; i++) {
            dataset[i.toString()] = 0;
        }
    
        let userSkillsCount = 0;
        let profiles: ProfileSimple[] = await dbGetStudentProfiles();

        for (const profile of profiles) {
            if (profile.zid === customReq.token.zid) {
                userSkillsCount = profile.Skills.length;
            }
            const skills = profile.Skills.length;
            dataset[skills.toString()] += 1;
        }

        let usersWithLessSkills = 0;
        for (let i = 0; i < userSkillsCount; i++) {
            usersWithLessSkills += dataset[i.toString()];
        }
        const percentage = Math.round((usersWithLessSkills / profiles.length) * 100);

        const constants = {
            numSkills: length,
            userSkillsCount: userSkillsCount,
            higherPercentage: percentage,
        }

        const payload = {
            dataset: dataset,
            constants: constants,
        }        
        res.status(200).send(payload);
    } catch (error) {
        console.error("Error in fetching skill leaderboard data", error);
        res.status(500).send("An error occurred while fetching skill leaderboard data");
    }
})

export default router;