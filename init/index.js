const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/OneNight";

dbConnection()
  .then(() => {
    console.log("Database Connected!");
  })
  .catch((error) => {
    console.log("Error: ", error);
  });

async function dbConnection(params) {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data is initialized!");
};
initDB();
