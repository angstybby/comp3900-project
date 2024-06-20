import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface RequestWithUser extends Request {
    user: jwt.JwtPayload | string;
}

const cookieJwtAuth = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const token = req.cookies.token;
    try {
        const user = jwt.verify(token, process.env.MY_SECRET as string);
		(req as RequestWithUser).user = user;
        next();
    } catch (err) {
        res.clearCookie("token");
        return res.redirect("/");
    }
};

export default cookieJwtAuth;
