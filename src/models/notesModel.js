import mongoose from "mongoose";
import { generatePublicId } from "../commons/common-functions.js";

const notesSchema = {
  _id: { type: String, default: generatePublicId, required: true },
  title : {type : Object, required : true},
  description : {type : String, required : true},
  user_id : {type : String, required : true},
  created_at: { type: Date, default: Date.now },
};

const notesModel = mongoose.model("notes", notesSchema);

export default notesModel;