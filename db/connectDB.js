const mongoose = require("mongoose");

const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database is connected!");
  } catch {
    console.log("There was an error connecting to the database.", error.message);
  }
};

module.exports = connectDB;