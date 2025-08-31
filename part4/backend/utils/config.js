import dotenv from "dotenv";
dotenv.config();

export const port = process.env.PORT || 3001;
export const db_uri =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_URI
    : process.env.MONGODB_URI;
