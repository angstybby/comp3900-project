import express from "express";
import {
    dbAddCourse,
    dbDeleteCourse,
    dbFindCourseByString,
    dbGetAllCourses,
    dbGetUserCourses,
} from "../models/course.models";
import { CustomRequest } from "../middleware/auth.middleware";
import PdfParse from "pdf-parse";
import { AIModel, getCourseSkillsContext, summarizeCourseOutlineContext } from "../utils/ai";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

/**
 * Search for a course by their course code or title
 * @name POST /search
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Response} A response object containing the courses matching the search string.
 */
router.post("/search", async (req, res) => {
    console.log("Searching for course");
    const { name } = req.body;

    if (!name) {
        return res.status(400).send("No search string provided");
    }

    const courses = await dbFindCourseByString(name);
    return res.status(200).send(courses);
});

/**
 * Adds the course to the list of courses taken by the user
 * @name POST /add
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the token is not valid.
 * @returns {Response} A response object indicating the success or failure of the course addition.
 */
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

/**
 * Removes the course from the list of courses taken by the user
 * @name DELETE /add
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the token is not valid.
 * @returns {Response} A response object indicating the success or failure of the course addition.
 */
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

/**
 * Given the zID of the user, returns the courses taken by the user
 * @name GET /user
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the token is not valid.
 * @returns {Response} A response object containing the courses taken by the user.
 */
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

/**
 * Route for parsing the outline of a course from a PDF file.
 * @name POST /parse-outline
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the token is not valid, no file is uploaded, or the file is not a PDF.
 * @returns {Response} A response object containing the course summary and skills extracted from the PDF.
 */
router.post("/parse-outline", upload.single("pdfUpload"), async (req, res) => {
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

router.get("/all", async (req, res) => {
    try {
        const customReq = req as CustomRequest;
        if (!customReq.token || typeof customReq.token === "string") {
            throw new Error("Token is not valid");
        }
        res.status(200).send(await dbGetAllCourses());
    } catch (error) {
        console.log(error);
        res.status(500).send('Failed fetching courses');
    }
})

export default router;
