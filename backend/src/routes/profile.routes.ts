import express from "express";
import { CustomRequest } from "../middleware/auth.middleware";
import { Request, Response } from "express";
import { dbGetProfile } from "../models/profile.models";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const customReq = req as CustomRequest;
        if (!customReq.token || typeof customReq.token === "string") {
            throw new Error("Token is not valid");
        }
        const profile = await dbGetProfile(customReq.token.email);
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).send("Error retrieving profile");
    }
});

// router.put("/update-profile", async (req, res) => {
//     // Check all the fields are present or correct

//     // Update the user's profile in the database

//     // Return a success message
// });

// router.post("/upload-resume", async (req, res) => {
//     // Take the resume and ensure it is a pdf or some format

//     // Upload it to some other database

//     // Then save the link to the resume in the user's profile in the db

//     // Return a success message
// });

export default router;
