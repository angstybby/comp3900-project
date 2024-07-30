import express from "express";
import {
    dbAcceptUserToGroup,
    dbCreateGroup,
    dbDeclineUserToGroup,
    dbGetGroup,
    dbGetGroupApplications,
    dbGetUserInGroup,
    dbGetUsersNotInGroup,
    dbGroupExpressInterstProject,
    dbInviteUserToGroup,
    dbIsUserJoinedGroup,
    dbKickUserFromGroup,
    dbLeaveGroup,
    dbUpdateGroup,
    dbUserExpressInterest,
    dbGetGroupMembers,
    dbGetAllGroups,
    dbCreateFeedback,
} from "../models/group.models";
import { dbFindUserByZid } from "../models/auth.models";
import { authMiddleWare, CustomRequest } from "../middleware/auth.middleware";
import { validateZid } from "../utils/auth.utils";
import {
    getGroupsReccsContext,
    getProjectReccsContext,
    getStudentReccsContext,
    model,
} from "../utils/ai";
import {
    dbGetAllProjectsWithSkills,
    dbGetProjectByName,
} from "../models/project.models";
import { dbGetUserSkills } from "../models/profile.models";

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

    let { groupName, description, zIds, maxMembers } = req.body;
    // Check if the request body contains the required fields
    if (!groupName || !description || !zIds || !maxMembers) {
        return res.status(400).send("Missing required fields");
    }

    const groupOwnerId = customReq.token.zid;

    // Check the zIds if they exist and are not empty
    if (zIds.length > 0) {
        console.log(zIds);
        zIds.forEach(async (zid: string) => {
            if (!validateZid(zid)) {
                return res.status(400).send("Invalid zid " + zid);
            }
            if (zid === groupOwnerId) {
                return res.status(400).send("Cannot add yourself to the group");
            }
            const user = await dbFindUserByZid(zid);
            if (!user) {
                return res.status(400).send("User " + zid + " does not exist");
            }
        });
    }

    try {
        const newGroup = await dbCreateGroup(
            groupName,
            description,
            groupOwnerId,
            parseInt(maxMembers),
        );

        console.log("Group Created");
        // Invite the users to the group

        console.log(zIds);

        if (zIds.length > 0) {
            try {
                zIds.forEach(async (zid: string) => {
                    await dbInviteUserToGroup(newGroup.id, groupOwnerId, zid);
                });
                return res.status(200).send("Group created successfully");
            } catch (error) {
                console.error(error);
                return res
                    .status(500)
                    .send("An error occurred while inviting users to group");
            }
        } else {
            return res.status(200).send("Group created successfully");
        }
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
        await dbLeaveGroup(parseInt(groupId), zid);
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

    const { groupId, groupName, description, maxMembers } = req.body;
    if (!groupId || !groupName || !description || !maxMembers) {
        return res.status(400).send("Missing required fields");
    }

    const zid = customReq.token.zid;

    try {
        await dbUpdateGroup(
            groupId,
            groupName,
            zid,
            description,
            parseInt(maxMembers),
        );
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

/**
 * @route GET /group/details/:groupId
 * @desc Get the details of a group
 * @access Private
 * @type RequestHandler
 * @param {number} groupId - The id of the group
 * @returns {Group} - The group details
 * @throws {Error} - If the request body is missing required fields
 * @throws {Error} - If an error occurs while fetching group details
 */
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
        return res
            .status(500)
            .send("An error occured while fetching group details");
    }
});

/**
 * @route POST /group/apply-project
 * @desc Apply a group to a project
 * @access Private
 * @returns {string} - Success message
 * @returns {Error} - If the request body is missing required fields
 * @throws {400} - If the request body is missing required fields
 * @throws {500} - If an error occurs while expressing interest
 */
router.post("/apply-project", async (req, res) => {
    const { groupId, projectId } = req.body;

    // check user is owner
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        throw new Error("Token is not valid");
    }

    const zid = customReq.token.zid;

    try {
        const result = await dbGroupExpressInterstProject(
            groupId,
            zid,
            projectId,
        );
        return res.status(200).send(result);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("An error occurred while expressing interest");
    }
});

/**
 * @route GET /group/not-in-group/:groupId
 * @desc Get all the users not in a group
 * @access Private
 * @returns {User[]} - Array of users not in the group
 * @returns {Error} - If an error occurs while fetching users not in group
 * @throws {500} - If an error occurs while fetching users not in group
 */
router.post("/not-in-group/:groupId", authMiddleWare, async (req, res) => {
    const { groupId } = req.params;
    const groupIdInt = parseInt(groupId);

    const groupSkills = req.body.groupSkills;
    if (!groupSkills) {
        return res.status(400).send("Bad Request: Group skills are required");
    }

    try {
        const users = await dbGetUsersNotInGroup(groupIdInt);
        let userSkillMap = "";
        for (const user of users) {
            let joinedSkills = "";
            for (const skills of user.Skills) {
                joinedSkills += skills.skillName + ", ";
            }
            userSkillMap += `${user.zid} - ${user.fullname} - ${joinedSkills}\n`;
        }

        const chat = model.startChat();
        const promptForAi = getStudentReccsContext(groupSkills, userSkillMap);
        const result = await chat.sendMessage(promptForAi);
        const recommendations = result.response.text().trim().split(",");

        const generalUsers = users.filter(
            (user) => !recommendations.includes(user.zid),
        );
        // Have to manually select to make sure the recommendations are provided in order
        const recommendedUsers = [];
        for (const recc of recommendations) {
            for (const user of users) {
                if (user.zid === recc) {
                    recommendedUsers.push(user);
                }
            }
        }

        const payload = {
            recommendedUsers,
            generalUsers,
        };

        return res.status(200).send(payload);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("An error occured while fetching users not in group");
    }
});

/**
 * @route GET /group/user-in-group/:groupId
 * @desc Get all the users in a group
 * @access Private
 * @returns {User[]} - Array of users in the group
 * @returns {Error} - If an error occurs while fetching users in group
 * @throws {500} - If an error occurs while fetching users in group
 */
router.get("/user-in-group/:groupId", authMiddleWare, async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        return res.status(401).send("Unauthorized");
    }

    const { groupId } = req.params;

    const groupIdInt = parseInt(groupId);

    try {
        const users = await dbIsUserJoinedGroup(
            groupIdInt,
            customReq.token.zid,
        );
        return res.status(200).send(users);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("An error occured while fetching users in group");
    }
});

/**
 * @route POST /group/get-reccs
 * @desc Get recommendations for a group
 * @access Private
 * @returns {Project[]} - Array of recommended projects
 * @returns {Error} - If the request body is missing required fields
 * @throws {400} - If the request body is missing required fields
 * @throws {500} - If an error occurs while getting recommendations
 */
router.post("/get-reccs", authMiddleWare, async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        return res.status(401).send("Unauthorized");
    }

    const { groupSkills, groupId } = req.body;
    if (!groupSkills) {
        return res.status(400).send("Bad Request: Prompt is required");
    }

    if (!groupId) {
        return res.status(400).send("Group ID is required");
    }

    try {
        const allProjects = await dbGetAllProjectsWithSkills(parseInt(groupId));
        const stringProjects = allProjects
            .map(
                (project) => `
            Details for Project: ${project.id}
            Title: ${project.title}
            Description: ${project.description}
            Skills: ${project.skills}
        `,
            )
            .join("\n");

        const promptForAi = getProjectReccsContext(groupSkills, stringProjects);
        const chat = model.startChat();
        const result = await chat.sendMessage(promptForAi);

        console.log(result.response.text());

        const projectIds = result.response
            .text()
            .trim()
            .split(",")
            .map((id) => id.trim());

        const projectPromises = projectIds.map(dbGetProjectByName);
        const projects = await Promise.all(projectPromises);

        const filteredProjects = projects.filter(
            (project) => project !== null && project !== undefined,
        );

        return res.status(200).send(filteredProjects);
    } catch (error) {
        console.error("Error getting recommendations:", error);
        return res.status(500).send("Failed to get recommendations");
    }
});

/**
 * @route GET /group/members/:groupId
 * @desc Get all the members in a group
 * @access Private
 * @returns {User[]} - Array of users in the group
 * @returns {Error} - If an error occurs while fetching members in group
 * @throws {500} - If an error occurs while fetching members in group
 */
router.get("/members/:groupId", async (req, res) => {
    const { groupId } = req.params;
    const groupIdInt = parseInt(groupId);

    try {
        const groupMembers = await dbGetGroupMembers(groupIdInt);
        return res.status(200).send(groupMembers);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("An error occured while fetching members in group");
    }
});

/**
 * @route POST /group/feedback
 * @desc Create a new feedback
 * @access Private
 * @type RequestHandler
 * @param {string} fromZid - The zid of the user giving feedback
 * @param {string} toZid - The zid of the user receiving feedback
 * @param {string} comment - The comment of the feedback
 * @param {number} rating - The rating of the feedback
 * @returns {Feedback} - The newly created feedback
 * @throws {Error} - If the request body is missing required fields
 * @throws {500} - If an error occurs while creating new feedback
 */
// get all groups
router.get("/allGroups", async (req, res) => {
    try {
        const groups = await dbGetAllGroups();
        res.json(groups);
    } catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).send("Internal Server Error");
    }
});

/**
 * @route POST /group/get-group-reco
 * @desc Get recommended groups based on skills and description
 * @access Private
 * @returns {Array} List of recommended groups
 * @throws {500} If an error occurs while fetching recommended groups
 */
router.post("/get-group-reco", authMiddleWare, async (req, res) => {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
        return res.status(401).send("Unauthorized");
    }

    const userSkills = await createUserSkillsString(customReq.token.zid);

    console.log("User Skills:", userSkills);

    if (!userSkills) {
        return res.status(200).send([]);
    }

    try {
        const allGroups = await dbGetAllGroups();
        const joinedGroups = await dbGetUserInGroup(customReq.token.zid);
        const user = await dbGetUserSkills(customReq.token.zid);

        if (!user.CareerPath) {
            user.CareerPath = "Not Chosen";
        }

        const detailedGroups = [];

        for (const group of allGroups) {
            const detailedGroup = await dbGetGroup(group.id);
            detailedGroups.push(detailedGroup);
        }

        const stringGroups = detailedGroups
            .map(
                (group) => `
          Details for Group: ${group.id}
          Name: ${group.groupName}
          Description: ${group.description}
          Skills: ${group.CombinedSkills.map((skill) => skill.skillName).join(
              ", ",
          )}
      `,
            )
            .join("\n");

        const stringJoinedGroups = joinedGroups
            .map(
                (group) => `
          Details for Joined Group: ${group.id}
          Name: ${group.groupName}
          Description: ${group.description}
      `,
            )
            .join("\n");

        const promptForAi = getGroupsReccsContext(
            userSkills,
            stringGroups,
            stringJoinedGroups,
            user.CareerPath,
        );

        console.log(promptForAi);

        const chat = model.startChat();
        const result = await chat.sendMessage(promptForAi);

        const groupIds = result.response
            .text()
            .trim()
            .split(",")
            .map((id) => id.trim());

        console.log("Group ids: \n", groupIds);

        const recommendedGroups = detailedGroups.filter((group) =>
            groupIds.includes(group.id.toString()),
        );

        return res.status(200).send(recommendedGroups);
    } catch (error) {
        console.error("Error getting recommendations:", error);
        return res.status(500).send("Failed to get recommendations");
    }
});

/**
 * @route POST /group/get-group-reco
 * @desc Get recommended groups based on skills and description
 * @access Private
 * @returns {Array} List of recommended groups
 * @throws {500} If an error occurs while fetching recommended groups
 */
const createUserSkillsString = async (zid: string) => {
    try {
        const user = await dbGetUserSkills(zid);
        let joinedSkills = "";
        if (user && user.Skills) {
            for (const skill of user.Skills) {
                joinedSkills += skill.skillName + ", ";
            }
            joinedSkills = joinedSkills.slice(0, -2);
        }
        return joinedSkills;
    } catch (error) {
        console.error("Error creating user skills string:", error);
        throw error;
    }
};

/**
 * @route POST /group/feedback
 * @desc Create a new feedback
 * @access Private
 * @type RequestHandler
 * @param {string} fromZid - The zid of the user giving feedback
 * @param {string} toZid - The zid of the user receiving feedback
 * @param {string} comment - The comment of the feedback
 * @param {number} rating - The rating of the feedback
 * @returns {Feedback} - The newly created feedback
 * @throws {Error} - If the request body is missing required fields
 * @throws {500} - If an error occurs while creating new feedback
 */
router.post("/feedback", async (req, res) => {
    const { fromZid, toZid, comment, rating } = req.body;

    if (!fromZid || !toZid || !comment || !rating) {
        return res.status(400).send("Missing required fields");
    }
    console.log("Received data:", { fromZid, toZid, comment, rating });
    try {
        const newFeedback = await dbCreateFeedback(
            fromZid,
            toZid,
            comment,
            rating,
        );
        console.log("feedback created:", newFeedback);
        return res.status(200).send(newFeedback);
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occured creating new feedback.");
    }
});

export default router;
