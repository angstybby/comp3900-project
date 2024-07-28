import express from "express";
import cors from "cors";
import auth from "./src/routes/auth.routes";
import { authMiddleWare } from "./src/middleware/auth.middleware";
import profile from "./src/routes/profile.routes";
import user from "./src/routes/user.routes";
import course from "./src/routes/course.routes";
import group from "./src/routes/group.routes";
import skills from "./src/routes/skills.routes";
import projects from "./src/routes/project.routes";
import leaderboard from "./src/routes/leaderboard.routes";

// Create an Express application
const app = express();
const cookieParser = require("cookie-parser");

app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

// Define the port to run the server on
const PORT = 3000;

const corsOptions = {
    origin:
        process.env.NODE_ENV == "production"
            ? "http://localhost:80"
            : "http://localhost:5173",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", auth);
app.use("/api/group", authMiddleWare, group);
app.use("/api/profile", authMiddleWare, profile);
app.use("/api/user", authMiddleWare, user);
app.use("/api/course", authMiddleWare, course);
app.use("/api/skills", authMiddleWare, skills);
app.use("/api/projects", authMiddleWare, projects);
app.use("/api/leaderboard", authMiddleWare, leaderboard);

app.use((req, res) => {
    console.log(`Unknown request: ${req.method} ${req.url}`);
    res.status(404).send("Unknown request");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
