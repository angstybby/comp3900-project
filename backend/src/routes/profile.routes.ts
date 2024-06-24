import express from "express";
import { CustomRequest } from "../middleware/auth.middleware";
import { Request, Response } from "express";
import { dbGetProfile, dbUpdateProfile } from "../models/profile.models";
import { Profile } from "@prisma/client";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const customReq = req as CustomRequest;
        if (!customReq.token || typeof customReq.token === "string") {
            throw new Error("Token is not valid");
        }
        const profile = await dbGetProfile(customReq.token.zid);
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).send("Error retrieving profile");
    }
});
// Works
router.put("/update-profile", async (req, res) => {
    // Check token is valid
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    // Check all the fields are present or correct
    let { zid, profilePicture, userType, fullname, description, resume } = req.body;

    // Checks if zid matches
    if (customReq.token.zid !== zid) {
        throw new Error("Zid is not valid");
    }

    // Construct the profile object
    const profile: Profile = {
        zid,
        profilePicture,
        userType,
        fullname,
        description,
        resume,
    };

    try {
        // Update the user's profile in the database
        await dbUpdateProfile(profile);

        // Return a success message
        res.status(200).send("Profile updated successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while updating the profile");
    }
});

// router.post("/upload-resume", async (req, res) => {
//     // Take the resume and ensure it is a pdf or some format

//     // Upload it to some other database

//     // Then save the link to the resume in the user's profile in the db

//     // Return a success message
// });

export default router;
