import mongoose from "mongoose";

export const dbConnection = () => {
  // Connect to MongoDB database
  const dbURL = process.env.DB_URL;

  mongoose
    .connect(dbURL)
    .then(() => {
      console.log("Connected to MongoDB database!");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB database: ", error);
      return;
    });
};
