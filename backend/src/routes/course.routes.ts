import express from "express";
import { dbFindCourseByString } from "../models/course.models";

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

export default router;
