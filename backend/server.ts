import express from "express";
import cors from "cors";
import {authMiddleWare} from "./src/middleware/auth.middleware";

import auth from "./src/routes/auth.routes";
import profile from "./src/routes/profile.routes";
import user from "./src/routes/user.routes";

// Create an Express application
const app = express();
const cookieParser = require('cookie-parser')

// Define the port to run the server on
const PORT = process.env.PORT || 5005;

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", auth);
app.use("/profile", authMiddleWare, profile);
app.use("/user", authMiddleWare, user)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
