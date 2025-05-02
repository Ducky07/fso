import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error("Error: MONGODB_URI environment variable not set.");
  process.exit(1);
}

const url = process.env.MONGODB_URI;
console.log("connecting to", url.replace(/:([^:]+)@/, ":*****@")); // hiding password
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

connectDB();
