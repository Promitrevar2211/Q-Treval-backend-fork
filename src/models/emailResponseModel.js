import mongoose from "mongoose";
import { generatePublicId } from "../commons/common-functions.js";

const emailResponseSchema = {
  _id: { type: String, default: generatePublicId, required: true },
  response : {type : Object, required : true},
  api_name : {type : String, required : true},
  user_name : {type : String, required : true},
  created_at: { type: Date, default: Date.now },
};

const emailResponseModel = mongoose.model("emailResponse", emailResponseSchema);

export default emailResponseModel;