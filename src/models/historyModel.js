import mongoose from "mongoose";
import { generatePublicId } from "../commons/common-functions";

const historySchema = {
  _id: { type: String, default: generatePublicId, required: true },
  user_id: { type: String, required: true },
  query: { type: String, required: true },
  response: { type: String, required: true },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  country: { type: String, default: "" },
  created_at: { type: String },
  updated_at: { type: String },
};

const HistoryModel = mongoose.model("history", historySchema);

export default HistoryModel;
