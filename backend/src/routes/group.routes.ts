import express from "express";
import { dbCreateGroup } from "../models/group.models";
import { dbFindUserByZid } from "../models/auth.models";
import { CustomRequest } from "../middleware/auth.middleware";
import { validateZid } from "../utils/auth.utils";

const router = express.Router();

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
        console.log(error);
        return res.status(500).send("An error occurred while creating group");
    }
});
