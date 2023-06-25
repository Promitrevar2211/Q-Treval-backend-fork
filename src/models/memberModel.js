import mongoose from "mongoose";
import { generatePublicId } from "../commons/common-functions";

const memberSchema = {
  _id: { type: String, default: generatePublicId, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  isDeleted: { type: Boolean, required: true, default: false },
  isVerified: { type: Boolean, required: true, default: false },
  created_at: { type: String, required: true },
  updated_at: { type: String, default: "" },
};

const MemberModel = mongoose.model("members", memberSchema);

export default MemberModel;
