import express from "express";
import cors from "cors";
import auth from "./src/routes/auth.routes";
import { authMiddleWare } from "./src/middleware/auth.middleware";
import profile from "./src/routes/profile.routes";
import user from "./src/routes/user.routes";
import course from "./src/routes/course.routes";
import group from "./src/routes/group.routes";
import skills from "./src/routes/skills.routes";

// Create an Express application
const app = express();
const cookieParser = require("cookie-parser");

// Define the port to run the server on
const PORT = process.env.PORT || 5005;

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", auth);
app.use("/group", authMiddleWare, group);
app.use("/profile", authMiddleWare, profile);
app.use("/user", authMiddleWare, user);
app.use("/course", authMiddleWare, course);
app.use("/skills", authMiddleWare, skills);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
