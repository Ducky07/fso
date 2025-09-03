import mongoose from "mongoose";
import { db_uri } from "./config.js";

if (!db_uri) {
  console.error("Error: MONGODB_URI environment variable not set.");
  process.exit(1);
}

console.log("connecting to", db_uri.replace(/:([^:]+)@/, ":*****@")); // hiding password
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(db_uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

connectDB();
