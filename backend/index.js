import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./route/users.js";

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, () => {
  console.log("connected to database");
});

app.listen(PORT, () => {
  console.log("the server is listening on port: " + PORT);
});

app.use("/users", userRoute);
