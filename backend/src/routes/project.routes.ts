import express, { Request, Response } from "express";
import { dbGetAllProjectApplications, dbGetProject, dbGetProjectOwnerById, dbGetProjects } from "../models/project.models";
import { CustomRequest } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/:id", async (req, res) => {
    // Get the project ID from the URL
    const { id } = req.params;
    try {
        const project = await dbGetProject(parseInt(id))
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
})

// Id is the project id
router.get("/applications/:id", async (req: Request, res: Response) => {
    // Check that hes the owner
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const zid = customReq.token.zid;
    const id = parseInt(req.params.id);

    try {
        const owner = await dbGetProjectOwnerById(id);
        if (!owner) {
            return res.status(404).send("Project not found");
        }
    
        if (owner.ProjectOwner.zid != zid) {
            return res.status(401).send("Unauthorized");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Project doesnt exist");
    }

    try {
        const result = await dbGetAllProjectApplications(id);
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
    }
});



export default router;
