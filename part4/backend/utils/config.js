import dotenv from "dotenv";
dotenv.config();

export const port = process.env.PORT || 3001;
export const db_uri = process.env.MONGODB_URI;
