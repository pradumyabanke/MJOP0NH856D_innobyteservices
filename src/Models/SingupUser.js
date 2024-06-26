const mongoose = require("mongoose");
//UserModel
const userSchema = new mongoose.Schema({
    
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },


}, { timestamps: true });

module.exports = mongoose.model("UserProfile", userSchema)

