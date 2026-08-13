import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

export default mongoose.models.User || mongoose.model("User", userSchema);
