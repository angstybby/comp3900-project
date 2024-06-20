import express from "express";
import validator from "validator";
import { sign } from "jsonwebtoken";
import { dbAddUser, dbFindUserByEmail } from "../models/auth.models";
import { sha256 } from "js-sha256";
import {
    validateName,
    validatePassword,
    validateZid,
} from "../utils/auth.utils";

const router = express.Router();

router.post("/register", async (req, res) => {
    console.log("Registering user");
    // Gets the email and password from the request body
    const { email, password, fullname, zid } = req.body;

    // Check if the email or password is missing
    if (!email || !password || !fullname || !zid) {
        return res.status(400).send("Some details are missing");
    }

    // Check if the zid is valid
    if (!validateZid(zid)) {
        return res.status(400).send("Zid is invalid");
    }

    // Check if the name is valid
    if (!validateName(fullname)) {
        return res.status(400).send("Name is invalid");
    }

    // Check if the email is valid
    if (!validator.isEmail(email)) {
        return res.status(400).send("Email is invalid");
    }

    // Check the password, length etc
    if (!validatePassword(password)) {
        return res.status(400).send("Password is invalid");
    }

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

    // Hash the password
    user.password = sha256(user.password);

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

    const passwordHash = sha256(password);

    // Check if the email exists in the database
    const user = await dbFindUserByEmail(email);
    if (!user || user.password !== passwordHash) {
        return res.status(400).send("Email or password is incorrect");
    }

    // Makes the token and sends it to the user
    if (!process.env.JWT_HASH) {
        return res.status(500).send("Server error");
    }

    // TODO change the user, to not include the password
    // Should just send the zid, email and fullname ?

    const token = sign(user, process.env.JWT_HASH, { expiresIn: "1d" });
    res.cookie("token", token);

    res.status(200).send("Successful login");
});

router.post("/logout", async (req, res) => {});

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
