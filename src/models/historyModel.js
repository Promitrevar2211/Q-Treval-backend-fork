import mongoose from "mongoose";
import { generatePublicId } from "../commons/common-functions";

const historySchema = {
  _id: { type: String, default: generatePublicId, required: true },
  user_id: { type: String, required: true },
  query: { type: String, required: true },
  response: { type: Object, required: true },
  destinationId : {type : String, required : true},
  place : {type : String, default : ""},
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  country: { type: String, default: "" },
  created_at: { type: Date, default: Date.now },
};

const HistoryModel = mongoose.model("aiTravelPlannerHistory", historySchema);

export default HistoryModel;
