import express from "express";
import { Request, Response } from "express";
import { CustomRequest } from "../middleware/auth.middleware";
import { dbFindJwtUserByZid } from "../models/auth.models";
import { dbGetAllUsersExcept, dbRemoveUser } from "../models/user.models";

const router = express.Router();

/**
 * Route to get all users.
 * @route GET /all
 * @returns {Object[]} An array of user objects.
 * @throws {Error} If there is an error retrieving the users.
 */
router.get("/all", async (req: Request, res: Response) => {
  try {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
      throw new Error("Token is not valid");
    }
    const user = await dbFindJwtUserByZid(customReq.token.zid);
    if (user.userType !== 'admin') {
      throw new Error("You do not have permission to view these informations!")
    }
    const users = await dbGetAllUsersExcept(user.zid);

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send("Error retrieving users");
  }
})

/**
 * Route to remove a user.
 * @route DELETE /remove/:zid
 * @param {String} zid The zid of the user to remove.
 * @returns {String} A success message.
 * @throws {Error} If there is an error removing the user.
 */
router.delete("/remove/:zid", async (req: Request, res: Response) => {
  try {
    const customReq = req as CustomRequest;
    if (!customReq.token || typeof customReq.token === "string") {
      throw new Error("Token is not valid");
    }
    const { zid } =  req.params;
    await dbRemoveUser(zid)
    res.status(200).send("Deleted successfully")
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting user")
  }
})

export default router;