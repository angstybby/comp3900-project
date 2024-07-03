import express from "express";
import { Request, Response } from "express";
import { CustomRequest } from "../middleware/auth.middleware";
import { dbFindJwtUserByZid } from "../models/auth.models";
import { dbGetAllUsersExcept } from "../models/user.models";
import { removeUnwantedFields } from "../utils/user.utils";

const router = express.Router();

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
    const otherUsers = await dbGetAllUsersExcept(user.zid);
    console.log(otherUsers[0])
    const cleanedUsers = removeUnwantedFields(otherUsers);
    console.log(cleanedUsers[0])

    res.status(200).send();
  } catch (error) {
    res.status(500).send("Error retrieving users");
  }
})

export default router;