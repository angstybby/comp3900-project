import express, { Request, Response } from "express";
import {
    dbAddCourse,
    dbDeleteCourse,
    dbFindCourseByString,
    dbGetUserCourses,
} from "../models/course.models";
import { CustomRequest } from "../middleware/auth.middleware";
import PdfParse from "pdf-parse";
import { AIModel, getCourseSkillsContext, summarizeCourseOutlineContext } from "../utils/ai";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/search", async (req, res) => {
    console.log("Searching for course");
    const { name } = req.body;

    if (!name) {
        return res.status(400).send("No search string provided");
    }

    const courses = await dbFindCourseByString(name);
    return res.status(200).send(courses);
});

router.post("/add", async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const { course } = req.body;
    const zid = customReq.token.zid;

    try {
        await dbAddCourse(zid, course);
        res.status(200).send("Course added successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while adding course");
    }
});

router.delete("/delete", async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const { course } = req.body;
    const zid = customReq.token.zid;

    try {
        await dbDeleteCourse(course, zid);
        res.status(200).send("Course deleted successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while deleting course");
    }
});

router.get("/user", async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const zid = customReq.token.zid;

    try {
        const courses = await dbGetUserCourses(zid);
        res.status(200).send(courses);
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while retrieving courses");
    }
});

router.post(
    "/parse-outline", 
    upload.single("pdfUpload"), 
    async (req: Request, res: Response) => {
    
    try {
        const customReq = req as CustomRequest;
        if (!customReq.token || typeof customReq.token === "string") {
            throw new Error("Token is not valid");
        }
    
        const file = req.file;
        // Check if file is present
        if (!file) {
            throw new Error("No file uploaded");
        }
        // Check if file is a pdf
        if (file.mimetype !== "application/pdf") {
            throw new Error("File is not a pdf");
        }
        const text = await PdfParse(file.buffer);
        const chat = AIModel.startChat();

        const summaryResult = await chat.sendMessage(`${summarizeCourseOutlineContext} Here is the text: ${text.text}`);
        const courseSummary = summaryResult.response.text();
        
        const skillsResult = await chat.sendMessage(`${getCourseSkillsContext} Here is the text: ${text.text}`);
        const courseSkills = skillsResult.response.text();

        const response = {
            summary: courseSummary,
            skills: courseSkills,
        }
        res.status(200).send(response)
    } catch (error) {
        console.log(error);
        res.status(500).send('Failed updating course skills');
    }

})

export default router;
