import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
  user_id: mongoose.Types.ObjectId,
  name: String,
});

export default mongoose.models.Word || mongoose.model("Word", wordSchema);
