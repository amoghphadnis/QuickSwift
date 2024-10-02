import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log("MongoDB Connected");
  });
  