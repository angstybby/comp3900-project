import express from "express";
import multer from "multer";

import { CustomRequest } from "../middleware/auth.middleware";
import { Request, Response } from "express";
import { dbGetFeedback, dbGetProfile, dbUpdateProfile } from "../models/profile.models";
import { Profile } from "@prisma/client";

import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { model, getCompletedCourseContext } from "../utils/ai";
import { dbAddCourse, dbFindCourseByStringExcTaken } from "../models/course.models";
import { parsePdfBuffer } from "../utils/pdf";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

const s3Client = new S3Client({
    region: "ap-southeast-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string,
    },
});

/**
 * Retrieve the profile details of the current user.
 * @route GET /profile
 * @function
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the profile is retrieved and sent as a JSON response.
 */
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

/**
 * Retrieve the profile details of a user with the specified zid.
 * @route GET /profile/:zid
 * @function
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the profile is retrieved and sent as a JSON response.
 */
router.get("/:zid", async (req: Request, res: Response) => {
    try {
        const zid = req.params.zid;
        const profile = await dbGetProfile(zid);
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).send("Error retrieving profile");
    }
});

/**
 * Update the profile details of the current user.
 * @route PUT /profile/update-profile
 * @function
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the profile details are updated and a success message is sent as a response.
 * @throws {Error} - If the token is not valid or the fields are missing or incorrect.
 */
router.put("/update-profile", async (req, res) => {
    // Check token is valid
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    // Check all the fields are present or correct
    let { zid, profilePicture, fullname, description, resume, CareerPath } = req.body;

    // Checks if zid matches
    if (customReq.token.zid !== zid) {
        throw new Error("Zid is not valid");
    }

    if (profilePicture.length > 5 * 1024 * 1024) {
        return res.status(413).send("Image payload too large");
    }

    // Construct the profile object
    const profile: Profile = {
        zid,
        profilePicture,
        fullname,
        description,
        resume,
        CareerPath,
    };

    console.log(CareerPath);

    try {
        // Update the user's profile in the database
        await dbUpdateProfile(profile);
        // Return a success message
        res.status(200).send("Profile details updated successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while updating the profile");
    }
});

/**
 * Extracts the complete courses from a transcript PDF file and adds them to the user's profile.
 * @route POST /profile/scrape-pdf
 * @function
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the PDF is parsed, the AI model is interacted with, and the extracted course codes are sent as a response.
 * @throws {Error} - If the token is not valid, no file is uploaded, or the file is not a PDF.
 */
router.post(
    "/scrape-pdf",
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

            // TODO: Finish this! Prompt still needs some work.
            // 1. Parse the pdf to obtain the text within
            const text = await parsePdfBuffer(file.buffer);
            // 2. Start a chat with the AI model
            const chat = model.startChat();
            // 3. Send the prompt to the AI model
            const result = await chat.sendMessage(
                `${getCompletedCourseContext} Here is the text: ${text}`,
            );
            // 4. Print their response
            console.log("--------------------");
            console.log(result.response.text());

            // Extract the course codes from the AI response
            const responseText = result.response.text();
            const courseCodeRegex = /\b[A-Z]{4}[0-9]{4}\b/g;
            const courseCodes = responseText.match(courseCodeRegex) || [];
            console.log(courseCodes);
            
            res.status(200).send(courseCodes);
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occured when scraping the PDF File");
        }
    },
);

/**
 * Uploads the transcript into the S3 buckets
 * @route POST /profile/upload-transcript
 * @function
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the file is uploaded to the S3 bucket and a success message is sent as a response.
 * @throws {Error} - If the token is not valid, no file is uploaded, or the file is not a PDF.
 */
router.post(
    "/upload-transcript",
    upload.single("pdfUpload"),
    async (req, res) => {
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
    },
);

/**
 * Adding courses to the user's profile based on a transcript PDF file.
 * @route POST /profile/add-courses-from-pdf
 * @function
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the courses are added to the user's profile and a success message is sent as a response.
 * @throws {Error} - If the token is not valid, no file is uploaded, or the file is not a PDF.
 */
router.post('/add-courses-from-pdf', upload.single('pdfUpload'), async (req, res) => {
  try {
      const customReq = req as CustomRequest;
      if (!customReq.token || typeof customReq.token === 'string') {
          throw new Error('Token is not valid');
      }

      const file = req.file;

      // Check if file is present
      if (!file) {
          throw new Error('No file uploaded');
      }

      // Check if file is a pdf
      if (file.mimetype !== 'application/pdf') {
          throw new Error('File is not a pdf');
      }
      const courseCodes = JSON.parse(req.body.scrapped);
      console.log(courseCodes);
      // Add each course to the user's profile
      for (const course of courseCodes) {
          console.log(course);
          const addcourse = await dbFindCourseByStringExcTaken(course, customReq.token.zid);
          if (addcourse.length > 0) {
              console.log(addcourse[0].id);
              await dbAddCourse(addcourse[0].id, customReq.token.zid);
          }
      }
      res.status(200).send('Courses added successfully');
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while processing the file');
  }
});

/**
 * Retrieve the feedbacks for the user with the specified zid.
 * @route GET /profile/feedbacks/:zid
 * @function
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the feedbacks are retrieved and sent as a JSON response.
 */
router.get('/feedbacks/:zid', async (req, res) => {
    const { zid } = req.params;

    try {
        const feedbacks = await dbGetFeedback(zid);
        console.log(feedbacks);
        console.log(zid);
        res.status(200).send(feedbacks)
        return feedbacks;
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occured fetching feedbacks for profile.')
    }
});

export default router;
