import express from "express";
import {
    dbAddCourse,
    dbDeleteCourse,
    dbFindCourseByString,
    dbGetUserCourses,
} from "../models/course.models";
import { CustomRequest } from "../middleware/auth.middleware";

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
    console.log("Searching for course");
    const { name } = req.body;

    if (!name) {
        return res.status(400).send("No search string provided");
    }

    const courses = await dbFindCourseByString(name);
    return res.status(200).send(courses);
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

export default router;
