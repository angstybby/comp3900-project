import express from "express";
import multer from "multer";

import { CustomRequest } from "../middleware/auth.middleware";
import { Request, Response } from "express";
import { dbGetProfile, dbUpdateProfile } from "../models/profile.models";
import { Profile } from "@prisma/client";

import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

const s3Client = new S3Client({
    region: "ap-southeast-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string,
    },
});

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

router.get("/:zid", async (req: Request, res: Response) => {
    try {
        const zid = req.params.zid;
        const profile = await dbGetProfile(zid);
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
    let { zid, profilePicture, userType, fullname, description, resume } =
        req.body;

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

router.post("/upload-resume", upload.single("pdfUpload"), async (req, res) => {
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

        console.log(file.buffer);

        const date = new Date().toISOString();

        // Upload file to S3
        try {
            const upload = new Upload({
                client: s3Client,
                params: {
                    Bucket: "skillissue-resume",
                    Key: `${customReq.token.zid}/resume-${date}.pdf`,
                    Body: file.buffer,
                },
            });

            await upload.done();
            res.status(200).json({ message: "File uploaded successfully" });
        } catch (s3error) {
            console.error(s3error);
            res.status(500).send("Error uploading file to S3");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while uploading file");
    }
});

export default router;
