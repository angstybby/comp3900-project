import express from "express";
import validator from "validator";
import { sign } from "jsonwebtoken";
import { dbAddUser, dbFindUserByEmail } from "../models/auth.models";
import { sha256 } from "js-sha256";

const router = express.Router();

router.post("/register", async (req, res) => {
    console.log("Registering user");
    // Gets the email and password from the request body
    const { email, password, fullname, zid } = req.body;

    // Check if the email or password is missing
    if (!email || !password || !fullname || !zid) {
        return res.status(400).send("Some details are missing");
    }

    // TODO check the zid, length etc
    // TODO check name

    // Check if the email is valid
    if (!validator.isEmail(email)) {
        return res.status(400).send("Email is invalid");
    }

    // TODO check the password, length etc

    // Check if the email is already in use
    dbFindUserByEmail(email).then((user) => {
        if (user) {
            return res.status(400).send("Email is already in use");
        }
    });

    const user = {
        zid,
        email,
        password,
        fullname,
    };

    // TODO Hash the password
    // Adds the user to the database
    await dbAddUser(user).catch((error) => {
        return res.status(500).send(error);
    });

    // Makes the token and sends it to the user
    if (!process.env.JWT_HASH) {
        return res.status(500).send("Server error");
    }
    const token = sign(user, process.env.JWT_HASH, { expiresIn: "1d" });
    res.cookie("token", token);

    // Send a success message
    res.status(200).send("User registered");
});

router.post("/login", async (req, res) => {
    // Gets the email and password from the request body
    const { email, password } = req.body;

    // Check if the email or password is missing
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    // Check if the email is valid
    if (!validator.isEmail(email)) {
        return res.status(400).send("Email is invalid");
    }

    // Check if the email exists in the database
    const user = await dbFindUserByEmail(email);
    if (!user || user.password !== password) {
        return res.status(400).send("Email or password is incorrect");
    }

    // Makes the token and sends it to the user
    if (!process.env.JWT_HASH) {
        return res.status(500).send("Server error");
    }
    const token = sign(user, process.env.JWT_HASH, { expiresIn: "1d" });
    res.cookie("token", token);

    res.status(200).send("Successful login");
});

// TODO add a reset password route
router.post("/reset-password", async (req, res) => {
    // Gets the email from the request body
    const { email } = req.body;

    // Check if the email is wrong
    if (!email || !validator.isEmail(email)) {
        return res.status(400).send("Email is required");
    }

    // Check if the email exists in the database
    const user = await dbFindUserByEmail(email);
    if (!user) {
        return res.status(400).send("Email is not registered");
    }

    // Generate a reset token
    const resetToken = sha256((Math.random() + 1).toString(36).substring(7));

    // TODO send an email with a reset link
    console.log("Reset link: " + resetToken);

    res.status(200).send("Reset link sent");
});

export default router;
