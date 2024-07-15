import express, { Request, Response } from "express";
import {
    dbAddCourse,
    dbDeleteCourse,
    dbFindCourseById,
    dbFindCourseByString,
    dbFindCourseByStringExcTaken,
    dbGetAllCourses,
    dbGetUserCourses,
    dbUpdateCourse,
} from "../models/course.models";
import { CustomRequest } from "../middleware/auth.middleware";
import PdfParse from "pdf-parse";
import {
    model,
    getCourseSkillsContext,
    summarizeCourseOutlineContext,
    generationConfig,
} from "../utils/ai";
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
    const { name } = req.body;

    if (!name) {
        return res.status(400).send("No search string provided");
    }
    const offsetStr = req.query.offset as string;
    let offset = 0;
    if (offsetStr !== undefined) {
        offset = parseInt(offsetStr);
    }
    const courses = await dbFindCourseByString(name, offset);
    return res.status(200).send(courses);
});

/**
 * Search for courses by name excluding courses already taken by the user
 * @name POST /course/search
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the token is not valid.
 * @returns {Response} A response object containing the matching courses.
 */
router.post("/searchExc", async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const zid = customReq.token.zid;
    const { name } = req.body;

    try {
        const courses = await dbFindCourseByStringExcTaken(name, zid);
        res.status(200).send(courses);
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while searching for courses");
    }
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

    const course = req.body.id;
    const zid = customReq.token.zid;

    try {
        await dbAddCourse(course, zid);
        res.status(200).send("Course added successfully");
        console.log("Course added");
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
        console.log("Course deleted");
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
        const chat = model.startChat({
            generationConfig,
        });

        const summaryResult = await chat.sendMessage(
            `${summarizeCourseOutlineContext} Here is the text: ${text.text}`,
        );
        const courseSummary = summaryResult.response.text();

        const skillsResult = await chat.sendMessage(
            `${getCourseSkillsContext} Here is the text: ${text.text}`,
        );
        const courseSkills = skillsResult.response.text();

        const response = {
            summary: courseSummary,
            skills: courseSkills,
        };

        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed updating course skills");
    }
});

/**
 * Route for fetching all courses
 * @name GET /all
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the token is not valid.
 * @returns {Response} A response object containing all courses
 */
router.get("/all", async (req, res) => {
    try {
        const customReq = req as CustomRequest;
        if (!customReq.token || typeof customReq.token === "string") {
            throw new Error("Token is not valid");
        }
        const offsetStr = req.query.offset as string;
        let offset = 0;
        if (offsetStr !== undefined) {
            offset = parseInt(offsetStr);
        }
        res.status(200).send(await dbGetAllCourses(offset));
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed fetching courses");
    }
});

/**
 * Route for fetching details of a specific course
 * @name GET /course-details/:courseId
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the token is not valid.
 * @returns {Response} A response object containing the course summary and skills of a certain course
 */
router.get("/course-details/:courseId", async (req: Request, res: Response) => {
    try {
        const customReq = req as CustomRequest;
        if (!customReq.token || typeof customReq.token === "string") {
            throw new Error("Token is not valid");
        }
        const { courseId } = req.params;
        res.status(200).send(await dbFindCourseById(courseId));
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while fetching course details");
    }
});

/**
 * Route for fetching details of a specific course
 * @name POST /update-details
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the token is not valid.
 * @returns {Response} Succesful update or failure message
 */
router.post("/update-details", async (req, res) => {
    try {
        const customReq = req as CustomRequest;
        if (!customReq.token || typeof customReq.token === "string") {
            throw new Error("Token is not valid");
        }

        const { course, summary, skills } = req.body;
        await dbUpdateCourse(course, summary, skills);
        res.status(200).send("Course details updated successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while updating course details");
    }
});

export default router;
