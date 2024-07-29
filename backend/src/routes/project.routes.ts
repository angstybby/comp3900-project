import express, { Request, Response } from "express";
import {
    dbAddProject,
    dbAddProjectSkills,
    dbDeleteProject,
    dbDeleteProjectSkills,
    dbGetAllProjectApplications,
    dbGetProject,
    dbGetProjects,
    dbAcceptGroupToProject,
    dbRejectGroupToProject,
    dbGetProjectByName,
    dbGetUserJoinedProjects,
    dbGetProjectsOwnedByUser,
    dbUpdateProject,
    dbUpdateProjectStatus
} from "../models/project.models";
import { authMiddleWare, CustomRequest } from "../middleware/auth.middleware";
import { isProjectOwner } from "../utils/project.utils";
import { getUserType } from "../models/profile.models";
import { UserType } from "@prisma/client";
import { dbFindUserByZid } from "../models/auth.models";

const router = express.Router();

/**
 * @route POST /projects/add
 * @desc Adds a project needs title, description and skills array but can be
 *       empty. User needs to be an academic to add a project
 * @access Private
 * @returns {String} Success message
 * @returns {String} Error message
 * @throws {400} If missing fields
 * @throws {401} If premissions invalid
 * @throws {500} If an error occurs while adding project
 *
 */
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
        console.error(error);
        return res.status(500).send("Failed fetching user type");
    }

    // Add the project
    const { title, description, skills } = req.body;
    if (!title || !description || !skills) {
        return res.status(400).send("Missing fields");
    }

    if ((await dbGetProjectByName(title)) !== null) {
        return res.status(400).send("Project with this title already exists");
    }

    if (!Array.isArray(skills)) {
        return res.status(400).send("Skills must be an array");
    }

    try {
        const projectId = await dbAddProject(zid, title, description, skills);
        const project = await dbGetProject(projectId);
        res.status(200).send(project);
    } catch (error) {
        console.error(error);
        res.status(400).send("Failed adding project");
    }
});

/**
 * @route POST /projects/delete
 * @desc Deletes a project. User needs to be the owner of the project
 * @access Private
 * @returns {String} Success message
 * @returns {String} Error message
 * @throws {400} If project ID is invalid
 * @throws {401} If premissions invalid
 * @throws {500} If an error occurs while deleting project
 *
 */
router.post("/delete", async (req, res) => {
    const projectId = parseInt(req.body.projectId);
    if (!projectId) {
        return res.status(400).send("Invalid project ID");
    }

    // Check that hes the owner
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const zid = customReq.token.zid;

    if (!(await dbGetProject(zid))) {
        return res.status(400).send("Project doesnt exist");
    }

    if (!(await isProjectOwner(zid, projectId))) {
        return res.status(401).send("You are not the owner of this project");
    }

    try {
        await dbDeleteProject(projectId);
        res.status(200).send("Project deleted");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed deleting project");
    }
});

/**
 * @route GET /projects/all
 * @desc Fetches all projects. If user is a student, return projects of groups they are in.
 *       If user is an academic, return projects they own. If user is an admin, return all projects
 * @access Private
 * @returns {Object} Projects
 * @throws {400} If skip is not a number
 * @throws {401} If user type is invalid
 * @throws {500} If an error occurs while fetching projects
 */
router.get("/all", async (req: Request, res: Response) => {
    // If student, return projects of groups they are in
    // If academic, return projects they own
    // If admin, return all projects
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const zid = customReq.token.zid;
    try {
        const skip = parseInt(req.query.skip as string);

        if (!skip && skip !== 0) {
            return res.status(400).send("Invalid skip value");
        }

        const userType = await getUserType(zid);
        if (!userType) {
            return res.status(401).send("User not found");
        }

        if (userType.userType === UserType.student) {
            // Get projects of groups they are in
            const projects = await dbGetUserJoinedProjects(zid, skip);

            // Filter out groups with no projects and flatten the project array
            const projectReturn = projects
                .map((group) => group.group.Project)
                .filter((projectArray) => projectArray.length > 0)
                .flat();

            return res.status(200).send(projectReturn);
        } else if (userType.userType === UserType.academic) {
            // Get projects they own
            const projects = await dbGetProjectsOwnedByUser(zid, skip);
            return res.status(200).send(projects);
        } else if (userType.userType === UserType.admin) {
            const projects = await dbGetProjects(skip);
            return res.status(200).send(projects);
        } else {
            return res.status(401).send("Invalid user type");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Failed fetching projects");
    }
});

/**
 * @route GET /projects/:id
 * @desc Fetches a project by ID
 * @access Public
 * @returns {Object} Project
 * @throws {500} If an error occurs while fetching project
 * @throws {400} If project ID is invalid
 */
router.get("/:id", async (req, res) => {
    // Get the project ID from the URL
    const id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).send("Invalid project ID");
    }

    try {
        const project = await dbGetProject(id);
        res.status(200).send(project);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed fetching project");
    }
});

/**
 * @route GET /projects
 * @desc Fetches all projects but is paginated
 * @access Public
 * @returns {Object} Projects
 * @throws {400} If skip is not a number
 * @throws {500} If an error occurs while fetching projects
 */
router.get("/", async (req, res) => {
    const skip = parseInt(req.body.skip);
    // Check if skip is a number
    if (skip != 0 && !skip) {
        console.log("Invalid skip value");
        return res.status(400).send("Invalid skip value");
    }

    try {
        res.status(200).send(await dbGetProjects(skip));
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed fetching projects");
    }
});

/**
 * @route GET /projects/applications/:id
 * @desc Fetches all applications for a project. User needs to be the owner of the project
 * @access Private
 * @returns {Object} Applications
 * @throws {401} If premissions invalid
 * @throws {500} If an error occurs while fetching project applications
 * @throws {400} If project ID is invalid
 */
router.get("/applications/:id", async (req: Request, res: Response) => {
    // Check that hes the owner
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const zid = customReq.token.zid;
    const id = parseInt(req.params.id);

    if (!(await isProjectOwner(zid, id))) {
        return res.status(401).send("You are not the owner of this project");
    }

    try {
        const result = await dbGetAllProjectApplications(id);
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed fetching project applications");
    }
});

/**
 * @route POST /projects/add-skills
 * @desc Adds skills to a project. User needs to be the owner of the project
 * @access Private
 * @returns {String} Success message
 * @returns {String} Error message
 * @throws {401} If premissions invalid
 * @throws {500} If an error occurs while adding skills to project
 * @throws {400} If missing fields
 */
router.post("/add-skills", async (req: Request, res: Response) => {
    const { projectId, skills } = req.body;

    if (!projectId || !skills) {
        return res.status(400).send("Missing fields");
    }

    // need to do checks
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const zid = customReq.token.zid;

    if (!(await isProjectOwner(zid, projectId))) {
        return res.status(401).send("You are not the owner of this project");
    }

    try {
        // Add skill to project
        const skillsArray = Array.isArray(skills) ? skills : [skills];

        await dbAddProjectSkills(projectId, skillsArray);
        res.status(200).send("Skills added to project");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed adding skill to project");
    }
});

/**
 * @route POST /projects/remove-skills
 * @desc Removes skills from a project. User needs to be the owner of the project
 * @access Private
 * @returns {String} Success message
 * @returns {String} Error message
 * @throws {401} If premissions invalid
 * @throws {500} If an error occurs while removing skills from project
 * @throws {400} If missing fields
 */
router.post("/remove-skills", async (req: Request, res: Response) => {
    const { projectId, skills } = req.body;

    // need to do checks
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const zid = customReq.token.zid;

    if (!(await isProjectOwner(zid, projectId))) {
        return res.status(401).send("You are not the owner of this project");
    }

    try {
        // Remove skill from project
        const skillsArray = Array.isArray(skills) ? skills : [skills];

        await dbDeleteProjectSkills(projectId, skillsArray);
        res.status(200).send("Skills removed from project");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed removing skill from project");
    }
});

/**
 * @route POST /projects/accept
 * @desc Accepts a group to a project. User needs to be the owner of the project
 * @access Private
 * @returns {String} Success message
 * @returns {String} Error message
 * @throws {400} If missing fields
 * @throws {401} If premissions invalid
 * @throws {500} If an error occurs while accepting group to project
 */
router.post("/accept", async (req: Request, res: Response) => {
    let { projectId, groupId } = req.body;

    projectId = parseInt(projectId);
    groupId = parseInt(groupId);

    console.log(projectId, groupId);

    if (!projectId || !groupId) {
        return res.status(400).send("Missing fields");
    }

    // need to do checks
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const ownerZid = customReq.token.zid;

    if (!(await isProjectOwner(ownerZid, projectId))) {
        return res.status(401).send("You are not the owner of this project");
    }

    try {
        // Accept group
        await dbAcceptGroupToProject(groupId, projectId);
        res.status(200).send("Group accepted");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

/**
 * @route POST /projects/reject
 * @desc Rejects a group from a project. User needs to be the owner of the project
 * @access Private
 * @returns {String} Success message
 * @returns {String} Error message
 * @throws {400} If missing fields
 * @throws {401} If premissions invalid
 * @throws {500} If an error occurs
 */
router.post("/reject", async (req: Request, res: Response) => {
    let { projectId, groupId } = req.body;

    projectId = parseInt(projectId);
    groupId = parseInt(groupId);

    if (!projectId || !groupId) {
        return res.status(400).send("Missing fields");
    }

    // need to do checks
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const ownerZid = customReq.token.zid;

    if (!(await isProjectOwner(ownerZid, projectId))) {
        return res.status(401).send("You are not the owner of this project");
    }

    try {
        // Accept group
        await dbRejectGroupToProject(groupId, projectId);
        res.status(200).send("Group rejected");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

router.put("/update", async (req: Request, res: Response) => {
    const { projectId, title, description, skills } = req.body;
    if (!projectId || !title || !description || !skills) {
        return res.status(400).send("Missing fields");
    }

    // need to do checks
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const zid = customReq.token.zid;

    if (!(await isProjectOwner(zid, projectId))) {
        return res.status(401).send("You are not the owner of this project");
    }

    try {
        // Update project
        await dbUpdateProject(projectId, title, description, skills);
        res.status(200).send("Project updated");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed updating project");
    }
});

/**
 * @route PUT /projects/:id/update-status
 * @desc Updates the status of a project. User needs to be the owner of the project
 * @access Private
 * @returns {String} Success message
 * @returns {String} Error message
 * @throws {400} If project ID or status is invalid
 * @throws {401} If permissions are invalid
 * @throws {500} If an error occurs while updating project status
 */
router.put("/:id/update-status", async (req: Request, res: Response) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const zid = customReq.token.zid;
    const projectId = parseInt(req.params.id);
    const { status } = req.body;

    if (!projectId || !status) {
        return res.status(400).send("Missing fields");
    }

    if (!(await isProjectOwner(zid, projectId))) {
        return res.status(401).send("You are not the owner of this project");
    }

    try {
        await dbUpdateProjectStatus(projectId, status);
        res.status(200).send("Project status updated");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed updating project status");
    }
});

router.get("/user/:zid", async (req: Request, res: Response) => {
    const { zid } = req.params;
    try {
        const profile = await dbFindUserByZid(zid);
        const user = await getUserType(zid);
        res.status(200).json({ ...profile });
    } catch (error) {
        console.error("Error fetching user projects", error);
        res.status(500).send("Failed fetching projects");
    }
});

export default router;
