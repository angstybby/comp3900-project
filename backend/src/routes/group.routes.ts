import express, { Request, Response } from "express";
import {
    dbAcceptUserToGroup,
    dbCreateGroup,
    dbDeclineUserToGroup,
    dbGetGroup,
    dbGetGroupApplications,
    dbGetUserInGroup,
    dbInviteUserToGroup,
    dbKickUserFromGroup,
    dbLeaveGroup,
    dbUpdateGroup,
    dbUserExpressInterest,
} from "../models/group.models";
import { dbFindUserByZid } from "../models/auth.models";
import { authMiddleWare, CustomRequest } from "../middleware/auth.middleware";
import { validateZid } from "../utils/auth.utils";
import { model } from "../utils/ai";

const router = express.Router();

/**
 * @route POST /group/create
 * @desc Create a new group
 * @access Private
 * @type RequestHandler
 * @param {string} groupName - Name of the group
 * @param {string} description - Description of the group
 * @param {string[]} zIds - Array of zIds of the group members
 * @returns {Group} - The newly created group
 * @throws {Error} - If the request body is missing required fields
 */
router.post("/create", async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const { groupName, description, zIds } = req.body;
    // Check if the request body contains the required fields
    if (!groupName || !description || !zIds) {
        return res.status(400).send("Missing required fields");
    }

    const groupOwnerId = customReq.token.zid;

    // Check the zIds if they exist and are not empty
    zIds.forEach((zid: string) => {
        if (!validateZid(zid)) {
            return res.status(400).send("Invalid zid" + zid);
        }
        if (zid === groupOwnerId) {
            return res.status(400).send("Cannot add yourself to the group");
        }
        if (!dbFindUserByZid(zid)) {
            return res.status(400).send("User does not exist");
        }
    });

    try {
        const newGroup = await dbCreateGroup(
            groupName,
            description,
            groupOwnerId,
            zIds,
        );
        return res.status(200).send(newGroup);
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while creating group");
    }
});

/**
 * @route POST /group/invite
 * @desc Invite a user to a group
 * @access Private
 * @type RequestHandler
 * @param {number} groupId - The id of the group
 * @param {string} zId - The zid of the user to invite
 * @returns {string} - Success message
 * @throws {Error} - If the request body is missing required fields
 */
router.post("/invite", async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const { groupId, zId } = req.body;
    if (!groupId || !zId) {
        return res.status(400).send("Missing required fields");
    }

    const groupOwnerId = customReq.token.zid;

    try {
        await dbInviteUserToGroup(groupId, groupOwnerId, zId);
        return res.status(200).send("User invited to group");
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("An error occurred while inviting user to group");
    }
});

/**
 * @route POST /group/express-interest
 * @desc Express interest in a group
 * @access Private
 * @type RequestHandler
 * @param {number} groupId - The id of the group
 * @returns {string} - Success message
 * @throws {Error} - If the request body is missing required fields
 * @throws {Error} - If an error occurs while expressing interest
 */
router.post("/express-interest", async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const { groupId } = req.body;
    if (!groupId) {
        return res.status(400).send("Missing required fields");
    }

    const zid = customReq.token.zid;

    try {
        await dbUserExpressInterest(groupId, zid);
        return res.status(200).send("Interest expressed successfully");
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("An error occurred while expressing interest");
    }
});

/**
 * @route POST /group/leave
 * @desc Leave a group
 * @access Private
 * @type RequestHandler
 * @param {number} groupId - The id of the group
 * @returns {string} - Success message
 * @throws {Error} - If the request body is missing required fields
 * @throws {Error} - If an error occurs while leaving the group
 */
router.post("/leave", async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const { groupId } = req.body;
    if (!groupId) {
        return res.status(400).send("Missing required fields");
    }

    const zid = customReq.token.zid;

    try {
        await dbLeaveGroup(groupId, zid);
        return res.status(200).send("User left group successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while leaving group");
    }
});

/**
 * @route PUT /group/update
 * @desc Update a group
 * @access Private
 * @type RequestHandler
 * @param {number} groupId - The id of the group
 * @param {string} groupName - The new name of the group
 * @param {string} description - The new description of the group
 * @returns {string} - Success message
 * @throws {Error} - If the request body is missing required fields
 * @throws {Error} - If an error occurs while updating the group
 */
router.put("/update", async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const { groupId, groupName, description } = req.body;
    if (!groupId || !groupName || !description) {
        return res.status(400).send("Missing required fields");
    }

    const zid = customReq.token.zid;

    try {
        await dbUpdateGroup(groupId, groupName, zid, description);
        return res.status(200).send("Group updated successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while updating group");
    }
});

/**
 * @route POST /group/kick
 * @desc Kick a user from a group
 * @access Private
 * @type RequestHandler
 * @param {number} groupId - The id of the group
 * @param {string} zId - The zid of the user to kick
 * @returns {string} - Success message
 * @throws {Error} - If the request body is missing required fields
 * @throws {Error} - If an error occurs while kicking the user
 */
router.post("/kick", async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const { groupId, zId } = req.body;
    if (!groupId || !zId) {
        return res.status(400).send("Missing required fields");
    }

    const groupOwnerId = customReq.token.zid;

    try {
        await dbKickUserFromGroup(groupId, groupOwnerId, zId);
        return res.status(200).send("User kicked from group");
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("An error occurred while kicking user from group");
    }
});

/**
 * @route POST /group/accept
 * @desc Accept a user to a group
 * @access Private
 * @type RequestHandler
 * @param {number} groupId - The id of the group
 * @param {string} zId - The zid of the user to accept
 * @returns {string} - Success message
 * @throws {Error} - If the request body is missing required fields
 */
router.post("/accept", async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const { groupId, zId } = req.body;
    if (!groupId) {
        return res.status(400).send("Missing required fields");
    }

    const groupOwnerId = customReq.token.zid;

    try {
        await dbAcceptUserToGroup(groupId, groupOwnerId, zId);
        return res.status(200).send("User accepted to group");
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("An error occurred while accepting user to group");
    }
});

/**
 * @route POST /group/decline
 * @desc Decline a user from a group
 * @access Private
 * @type RequestHandler
 * @param {number} groupId - The id of the group
 * @param {string} zId - The zid of the user to decline
 * @returns {string} - Success message
 * @throws {Error} - If the request body is missing required fields
 */
router.post("/decline", async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const { groupId, zId } = req.body;
    if (!groupId) {
        return res.status(400).send("Missing required fields");
    }

    const groupOwnerId = customReq.token.zid;

    try {
        await dbDeclineUserToGroup(groupId, groupOwnerId, zId);
        return res.status(200).send("User rejected from group");
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("An error occurred while rejecting user from group");
    }
});

/**
 * @route GET /group/group-applications/:groupId
 * @desc Get all the applications for a group
 * @access Private
 * @type RequestHandler
 * @param {number} groupId - The id of the group
 * @returns {GroupApplication[]} - Array of group applications
 * @throws {Error} - If the request body is missing required fields
 * @throws {Error} - If an error occurs while fetching group applications
 */
router.get("/group-applications/:groupId", authMiddleWare, async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        return res.status(401).send("Unauthorized");
    }

    const { groupId } = req.params;
    if (!groupId) {
        return res.status(400).send("Missing required fields");
    }

    const groupOwnerId = customReq.token.zid;

    try {
        const groupApplications = await dbGetGroupApplications(
            parseInt(groupId),
            groupOwnerId,
        );
        return res.status(200).send(groupApplications);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("An error occurred while fetching group applications");
    }
});

/**
 * @route GET /group/groups
 * @desc Get all the groups the user is in
 * @access Private
 * @type RequestHandler
 * @returns {Group[]} - Array of groups the user is in
 * @throws {Error} - If an error occurs while fetching groups
 */
router.get("/groups", authMiddleWare, async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        return res.status(401).send("Unauthorized");
    }

    const zid = customReq.token.zid;

    try {
        const groups = await dbGetUserInGroup(zid);
        return res.status(200).send(groups);
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while fetching groups");
    }
});

router.get("/details/:groupId", authMiddleWare, async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        return res.status(401).send("Unauthorized");
    }

    const { groupId } = req.params;
    
    const groupIdInt = parseInt(groupId);

    try {
        const group = await dbGetGroup(groupIdInt);
        return res.status(200).send(group);
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occured while fetching group details");
    }
});

///////////////////////////// STUB!!! DELETE LATER /////////////////////////////
router.post("/stub", authMiddleWare, async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        return res.status(401).send("Unauthorized");
    }

    const prompt = req.body.prompt;

    try {
        const chat = model.startChat();
        const result = await chat.sendMessage(`${prompt}`);
        return res.status(200).send(result.response.text());
    } catch (error) {
        console.error(error);
        return res.status(500).send("Failed to get recommendations");
    }
})

export default router;
