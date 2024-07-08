import express from "express";
import {
    dbAddCourse,
    dbDeleteCourse,
    dbFindCourseByString,
    dbGetUserCourses,
} from "../models/course.models";
import { CustomRequest } from "../middleware/auth.middleware";

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
    // changed it to req.body.id to get course id
    const course = req.body.id;
    const zid = customReq.token.zid;

    console.log(course);
    console.log(zid);

    try {
        await dbAddCourse(course, zid);
        res.status(200).send("Course added successfully");
        console.log("COMPLETED");
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

export default router;
