import express from "express";
import cors from "cors";
import auth from "./src/routes/auth.routes";

// Create an Express application
const app = express();

// Define the port to run the server on
const PORT = process.env.PORT || 5005;

app.use(cors()); // Use this after the variable declaration
app.use(express.json());

app.use("/auth", auth);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
