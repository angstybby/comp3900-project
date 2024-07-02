import express from "express";
import validator from "validator";
import { sign } from "jsonwebtoken";
import {
    JwtUser,
    dbAddUser,
    dbFindJwtUserByZid,
    dbFindUserByEmail,
    dbSetNewPassword,
    dbSetResetToken,
} from "../models/auth.models";
import { sha256 } from "js-sha256";
import {
    validateName,
    validatePassword,
    validateZid,
} from "../utils/auth.utils";
import { dbAddProfile } from "../models/profile.models";

const router = express.Router();

router.post("/register", async (req, res) => {
    console.log("Registering user");
    // Gets the email and password from the request body
    const { email, password, fullname, zid, userType } = req.body;

    // Check if the email or password is missing
    if (!email || !password || !fullname || !zid || !userType) {
        return res.status(400).send("Some details are missing");
    }

    // Check if the zid is valid
    // TODO check that the zid hasnt been used
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

    // Hash the password
    const hashedPassword = sha256(password);

    // Adds the user to the database
    await dbAddUser(zid, email, hashedPassword, userType).catch((error) => {
        return res.status(500).send(error);
    });
    await dbAddProfile(zid, fullname).catch((error) => {
        return res.status(500).send(error);
    });

    // Makes the token and sends it to the user
    const jwtUser: JwtUser = await dbFindJwtUserByZid(zid);
    if (!process.env.JWT_HASH) {
        return res.status(500).send("Server error");
    }
    const token = sign(jwtUser, process.env.JWT_HASH, { expiresIn: "1d" });
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

    const jwtUser: JwtUser = await dbFindJwtUserByZid(user.zid);

    const token = sign(jwtUser, process.env.JWT_HASH, { expiresIn: "1d" });
    res.cookie("token", token);
    res.status(200).send("Successful login");

    
});

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
    // Setting it in the db
    try {
        await dbSetResetToken(email, resetToken);
    } catch (error) {
        console.log("setting reset token issue");
        return res.status(500).send("Server error");
    }
    console.log("Reset token: " + resetToken);

    res.status(200).send("Reset link sent");
});

router.post("/change-password", async (req, res) => {
    const { resetToken, password } = req.body;

    if (!resetToken || !password) {
        return res.status(400).send("Reset token and password are required");
    }

    const hashedPassword = sha256(password);

    console.log("reseting password: ", resetToken, hashedPassword);

    try {
        await dbSetNewPassword(resetToken, hashedPassword);
    } catch (error) {
        console.log("setting new password issue");
        return res.status(500).send("Server error");
    }
    res.status(200).send("Password changed");
});

export default router;
