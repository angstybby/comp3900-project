import express from "express";
import validator from "validator";
import { sign } from "jsonwebtoken";
import {
    JwtUser,
    dbAddUser,
    dbFindJwtUserByZid,
    dbFindUserByEmail,
    dbFindUserByZid,
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
import axios from "axios";
import { authMiddleWare, CustomRequest } from "../middleware/auth.middleware";

const request = require('request-promise');

const router = express.Router();

/**
 * Endpoint for user registration.
 * Registers a new user with the provided email, password, fullname, zid, and userType.
 * @name POST /register
 * @function
 * @memberof module:routes/auth.routes
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {string} req.body.fullname - The full name of the user.
 * @param {string} req.body.zid - The zID of the user.
 * @param {string} req.body.userType - The type of user (e.g., student, staff).
 * @returns {Response} The response object.
 */
router.post("/register", async (req, res) => {
    console.log("Registering user");
    // Gets the email and password from the request body
    const { email, password, fullname, zid, userType } = req.body;

    // Check if the email or password is missing
    if (!email || !password || !fullname || !zid || !userType) {
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
    const emailExists = await dbFindUserByEmail(email);
    if (emailExists) {
        return res.status(409).send("Email is already in use");
    }

    // Check if the zid is already in use
    const zidExists = await dbFindUserByZid(zid);
    if (zidExists) {
        return res.status(409).send("zID is already in use");
    }

    // Hash the password
    const hashedPassword = sha256(password);

    // Adds the user to the database
    try {
        await dbAddUser(zid, email, hashedPassword, userType);
        await dbAddProfile(zid, fullname);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }

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

/**
 * Endpoint for user login.
 * Logs in a user with the provided email and password.
 * @name POST /login
 * @function
 * @memberof module:routes/auth.routes
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @returns {Response} The response object.
 */
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


/**
 * Endpoint for resetting user password.
 * Sends a reset link to the user's email.
 * @name POST /reset-password
 * @function
 * @memberof module:routes/auth.routes
 * @param {string} req.body.email - The email of the user.
 * @returns {Response} The response object.
 */
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


/**
 * Endpoint for changing user password.
 * Changes the user's password using the provided reset token and new password.
 * @name POST /change-password
 * @function
 * @memberof module:routes/auth.routes
 * @param {string} req.body.resetToken - The reset token for password change.
 * @param {string} req.body.password - The new password.
 * @returns {Response} The response object.
 */
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

/**
 * Endpoint for LinkedIn integration. Signs the user in using LinkedIn. Sync details
 * with their respective LinkedIn account. Redirects the user to the LinkedIn authorization page.
 * @name GET /proxy/linkedin
 * @function
 * @memberof module:routes/auth.routes
 * @returns {Response} The response object.
 */
router.get('/proxy/linkedin', async (req, res) => {
    try {
        const clientId = process.env.LINKEDIN_CLIENT_ID;
        const redicectUri = process.env.REDIRECT_URL;
        const state = process.env.LINKEDIN_STATE;
        const scope = 'openid%20profile%20w_member_social';

        const connectToLinkedIn = async () => {
            try {
                const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redicectUri}&state=${state}&scope=${scope}`;
                console.log('Redirecting to LinkedIn:', url);
                res.redirect(url);
            } catch (error) {
                console.log(error);
                return res.status(500).send('An error occurred while processing');
            }
        }
        connectToLinkedIn();
    } catch (error) {
        console.error(error);
        return res.status(500).send('An error occurred while processing');
    }
});

/**
 * Callback endpoint for LinkedIn integration.
 * Handles the callback after the user authorizes LinkedIn integration.
 * @name GET /proxy/linkedin/callback
 * @function
 * @memberof module:routes/auth.routes
 * @param {string} req.query.code - The authorization code from LinkedIn.
 * @returns {Response} The response object.
 */
router.get('/proxy/linkedin/callback', async (req, res) => {
    const authCode = req.query.code as string;

    ///////////////////////////////////////
    // May need to edit once deployed!!! //
    ///////////////////////////////////////
    let frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) frontendUrl = 'http://localhost:5173';

    if (!authCode) {
        res.redirect(frontendUrl);
    } else {
        const tokenBaseUrl = "https://www.linkedin.com/oauth/v2/accessToken";
        const data = {
            grant_type: 'authorization_code',
            code: authCode,
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_SECRET,
            redirect_uri: process.env.REDIRECT_URL,
        };
        
        try {
            const tokenResponse = await request.post({ url: tokenBaseUrl, form: data, json: true });
            res.cookie("linkedIn_AccessToken", tokenResponse.access_token);
            res.redirect(`${frontendUrl}?update=true`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('An error occurred obtaining access token');
        }
    }
});

/**
 * Endpoint for fetching LinkedIn user details. Retrieves the user details from LinkedIn using the access token.
 * @name GET /proxy/linkedin/details
 * @function
 * @memberof module:routes/auth.routes
 * @returns {Response} The response object.
 */
router.get('/proxy/linkedin/details', async (req, res) => {
    const cookie = req.headers.cookie;
    let accessToken;
    try {
        accessToken = cookie?.split('linkedIn_AccessToken=')[1].split(';')[0];
    } catch (error) {
        return res.status(400).send('No LinkedIn access token found');
    }

    try {
        const response = await axios.get("https://api.linkedin.com/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })

        const pictureResponse = await axios.get(response.data.picture, {responseType: 'arraybuffer'});
        const buffer = Buffer.from(pictureResponse.data, 'binary');
        const dataURL = `data:${pictureResponse.headers['content-type']};base64,${buffer.toString('base64')}`;

        const payload = response.data;
        payload.picture = dataURL;
        res.status(200).send(payload);

    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching LinkedIn data');
    }
});

/**
 * Endpoint for sharing content on LinkedIn.
 * Shares the provided text content on the user's LinkedIn profile.
 * @name POST /proxy/linkedin/share
 * @function
 * @memberof module:routes/auth.routes
 * @param {string} req.body.shareText - The text content to be shared on LinkedIn.
 * @returns {Response} The response object.
 */
router.post('/proxy/linkedin/share', authMiddleWare, async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const cookie = req.headers.cookie;
    let accessToken;
    try {
        accessToken = cookie?.split('linkedIn_AccessToken=')[1].split(';')[0];
    } catch (error) {
        return res.status(400).send('No LinkedIn access token found');
    }

    try {
        const userInfo = await axios.get("https://api.linkedin.com/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
        const { shareText } = req.body;
        const shareResponse = await axios.post("https://api.linkedin.com/v2/ugcPosts", 
            {
                "author": `urn:li:person:${userInfo.data.sub}`,
                "lifecycleState": "PUBLISHED",
                "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                        "shareCommentary": {
                            "text": `${shareText}`
                        },
                        "shareMediaCategory": "NONE"
                    }
                },
                "visibility": {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                }
            }, 
            {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
        res.status(200).send(`https://www.linkedin.com/feed/update/${shareResponse.data.id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while sharing post');
    }
});

export default router;
