import express, { Request, Response } from "express";
import {
    dbAddProject,
    dbAddProjectSkills,
    dbDeleteProjectSkills,
    dbGetAllProjectApplications,
    dbGetProject,
    dbGetProjects,
} from "../models/project.models";
import { CustomRequest } from "../middleware/auth.middleware";
import { isProjectOwner } from "../utils/project.utils";
import { getUserType } from "../models/profile.models";
import { UserType } from "@prisma/client";

const router = express.Router();

router.post("/add", async (req, res) => {
    // Check that hes the owner
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const zid = customReq.token.zid;

    // Check if the user is an academic
    try {
        const userType = await getUserType(zid);
        if (!userType) {
            return res.status(401).send("User not found");
        }
        if (userType.userType !== UserType.academic) {
            return res.status(401).send("You are not an academic");
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send("Failed fetching user type");
    }

    // Add the project
    const { title, description, skills } = req.body;
    try {
        const project = await dbAddProject(zid, title, description, skills);
        res.status(200).send(project);
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed adding project");
    }
});
router.get("/delete", async (req, res) => {});

router.get("/:id", async (req, res) => {
    // Get the project ID from the URL
    const { id } = req.params;
    try {
        const project = await dbGetProject(parseInt(id));
        res.status(200).send(project);
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed fetching project");
    }
});

//Route for fetching all projects with a skip value
router.get("/", async (req, res) => {
    const { skip } = req.body;

    try {
        res.status(200).send(await dbGetProjects(skip));
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed fetching projects");
    }
});

// Id is the project id
router.get("/applications/:id", async (req: Request, res: Response) => {
    // Check that hes the owner
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const zid = customReq.token.zid;
    const id = parseInt(req.params.id);

    if (await isProjectOwner(zid, id)) {
        return res.status(401).send("You are not the owner of this project");
    }

    try {
        const result = await dbGetAllProjectApplications(id);
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed fetching project applications");
    }
});

router.post("/add-skills", async (req: Request, res: Response) => {
    const { projectId, skills } = req.body;

    // need to do checks
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const zid = customReq.token.zid;

    if (await isProjectOwner(zid, projectId)) {
        return res.status(401).send("You are not the owner of this project");
    }

    try {
        // Add skill to project
        const skillsArray = Array.isArray(skills) ? skills : [skills];

        await dbAddProjectSkills(projectId, skillsArray);
        res.status(200).send("Skills added to project");
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed adding skill to project");
    }
});

router.post("/remove-skills", async (req: Request, res: Response) => {
    const { projectId, skills } = req.body;

    // need to do checks
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const zid = customReq.token.zid;

    if (await isProjectOwner(zid, projectId)) {
        return res.status(401).send("You are not the owner of this project");
    }

    try {
        // Remove skill from project
        const skillsArray = Array.isArray(skills) ? skills : [skills];

        await dbDeleteProjectSkills(projectId, skillsArray);
        res.status(200).send("Skills removed from project");
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed removing skill from project");
    }
});

export default router;
