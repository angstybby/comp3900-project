import express, { Request, Response } from "express";
import {
    dbAddCourse,
    dbDeleteCourse,
    dbFindCourseById,
    dbFindCourseByString,
    dbFindCourseByStringExcTaken,
    dbGetAllCourses,
    dbGetCourse,
    dbGetUserCourses,
    dbUpdateCourse,
} from "../models/course.models";
import { CustomRequest } from "../middleware/auth.middleware";
import {
    model,
    getCourseSkillsContext,
    summarizeCourseOutlineContext,
    generationConfig,
    getCourseSkillsRatingContext,
} from "../utils/ai";
import multer from "multer";
import { dbUpdateSkillsRatings } from "../models/skills.models";
import PDFParser from "pdf2json"; 
import { parsePdfBuffer } from "../utils/pdf";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

/**
 * @route POST /course/search
 * @desc Search for a course
 * @access Public
 * @returns {Array} Array of courses
 * @returns {String} Error message
 * @throws {400} If no search string is provided
 * @throws {500} If an error occurs while searching for course
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
 *  * Search for courses by name excluding courses already taken by the user
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
 * @route POST /course/add
 * @desc Add a course to user
 * @access Private
 * @returns {String} Success message
 * @returns {String} Error message
 * @throws {400} If no course is provided
 * @throws {500} If an error occurs while adding course
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
 * @route DELETE /course/delete
 * @desc Delete a course from user
 * @access Private
 * @returns {String} Success message
 * @returns {String} Error message
 * @throws {400} If no course is provided
 * @throws {500} If an error occurs while deleting course
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

        const text = await parsePdfBuffer(file.buffer);
        console.log("text:", text);

        const chat = model.startChat({
            generationConfig,
        });

        const summaryResult = await chat.sendMessage(
            `${summarizeCourseOutlineContext} Here is the text: ${text}`,
        );
        const courseSummary = summaryResult.response.text();

        const skillsResult = await chat.sendMessage(
            `${getCourseSkillsContext} Here is the text: ${text}`,
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

/**
 * Route for generating course skills rating context
 * @name POST /generate-skill-rating/:id
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the course is not found.
 * @returns {Response} Success message or error message
 */
router.post("/generate-skill-rating/:id", async (req, res) => {
    const courseId = req.params.id;

    try {
        const course = await dbGetCourse(courseId);
        if (!course) {
            return res.status(400).send("Course not found");
        }

        const skills = course.skills.map((skill) => skill.skillName);
        const description = course.summary;
        const title = course.courseName;

        if (!skills || skills.length === 0) {
            return res.status(400).send("No skills found for course");
        }

        if (!description || description.length === 0) {
            return res.status(400).send("No description found for course");
        }

        if (!title || title.length === 0) {
            return res.status(400).send("No title found for course");
        }

        const prompt = getCourseSkillsRatingContext(skills, title, description);

        const chat = model.startChat();
        const result = await chat.sendMessage(prompt);
        const response = result.response.text();

        console.log(response);

        const lines = response.trim().split("\n");

        // Initialize arrays to hold skill names and ratings
        const skillNames: string[] = [];
        const skillRatings: number[] = [];

        // Process each line to extract skill names and ratings
        lines.forEach((line) => {
            const [skill, rating] = line.split(":");
            console.log(skill, rating);
            skillNames.push(skill.trim());
            skillRatings.push(parseInt(rating.replace(/\D/g, "")));
        });

        // update course skills with ratings
        await dbUpdateSkillsRatings(courseId, skillNames, skillRatings);
        console.log("Course skills ratings updated successfully");
        res.status(200).send("Course skills ratings generated successfully");
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .send(
                "An error occurred while generating course skills rating context",
            );
    }
});

export default router;
