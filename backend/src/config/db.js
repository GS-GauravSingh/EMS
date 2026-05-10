import mongoose from "mongoose";
import { env } from "../helpers/env.js";

export async function connectDb() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDb Connected!!")
  } catch (error) {
    console.error("An error occure while establishing MongoDB connection").
    console.error(error);
  }
}
