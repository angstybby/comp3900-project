import express from "express";
import cors from "cors";
import auth from "./src/routes/auth.routes";
import {authMiddleWare} from "./src/middleware/auth.middleware";
import profile from "./src/routes/profile.routes";

// Create an Express application
const app = express();

// Define the port to run the server on
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

app.use("/auth", auth);
app.use("/profile", authMiddleWare, profile);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
