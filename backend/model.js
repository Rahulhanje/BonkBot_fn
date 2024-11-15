import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Error connecting to MongoDB:"));

// Define the schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    privateKey: String, // Adjusted capitalization for consistency
    publicKey: String   // Adjusted capitalization for consistency
});

// Create the model
const userModel = mongoose.model("User", userSchema);

export default userModel;
