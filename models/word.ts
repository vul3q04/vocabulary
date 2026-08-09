import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
  name: String
});

export default mongoose.models.Word || mongoose.model("Word", wordSchema);