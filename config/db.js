const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


// const stripe_key = process.env.STRIPE_SECRET_KEY
const mongodb_uri = process.env.MONDODB_URI; 

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(mongodb_uri);
        console.log("MongoDB connection successful");
    } catch (error) {
        console.log("MongoDB error: " + error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
