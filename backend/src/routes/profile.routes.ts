import express from "express";

const router = express.Router();

router.put("/update-profile", async (req, res) => {
    // Check all the fields are present or correct

    // Update the user's profile in the database

    // Return a success message
});

router.post("/upload-resume", async (req, res) => {
    // Take the resume and ensure it is a pdf or some format

    // Upload it to some other database

    // Then save the link to the resume in the user's profile in the db

    // Return a success message
});


