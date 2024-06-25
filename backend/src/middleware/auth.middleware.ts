import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const authMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new Error();
        }

        if (!process.env.JWT_HASH) {
            res.status(500).send("Internal server error JWT_HASH not set");
            return;
        }
        const decoded = verify(token, process.env.JWT_HASH);
        (req as CustomRequest).token = decoded;

        next();
    } catch (err) {
        res.status(401).send("Please authenticate");
    }
};
