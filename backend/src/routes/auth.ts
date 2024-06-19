import express from "express";
import validator from 'validator';
import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();


router.post("/register", async (req, res) => {
    console.log("Registering user");
    // Gets the email and password from the request body
    const { email, password, fullname, zid } = req.body;

    // Check if the email or password is missing
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    // Check if the email is valid
    if (!validator.isEmail(email)) {
        return res.status(400).send("Email is invalid");
    }

    // TODO check the password, length etc

    // Check if the email is already in use
    prisma.user.findFirst({
        where: {
            email: email
        }
    }).then((user) => {
        if (user) {
            return res.status(400).send("Email is already in use");
        }
    })

    const user = {
        zid,
        email,
        password,
        fullname,
    }

    // TODO Hash the password
    // Adds the user to the database
    prisma.user.create({
        data: user
    }).then((user) => {
        console.log("User created", user);
    }).catch((error) => {
        console.log(error);
        return res.status(500).send("An error occurred");
    });

    // Makes the token and sends it to the user
    if (!process.env.JWT_HASH) {
        return res.status(500).send("Server error");
    }
    const token = sign(user, process.env.JWT_HASH, { expiresIn: "1d" });
    res.cookie("token", token);


    // Send a success message
    res.send("User registered");
});


export default router;
