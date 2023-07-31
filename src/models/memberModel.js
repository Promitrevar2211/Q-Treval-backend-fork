import mongoose from "mongoose";
import { generatePublicId } from "../commons/common-functions.js";

const memberSchema = {
  _id: { type: String, default: generatePublicId, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  dob: { type: Date, default: Date.now, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  status: {
    type: String,
    required: true,
    default: "unverified",
    enum: ["unverified", "verified", "approved", "deleted"],
  },
  notifications: {type: Array, default:[]},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
};

const MemberModel = mongoose.model("members", memberSchema);

export default MemberModel;
