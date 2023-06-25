import mongoose from "mongoose";
import { generatePublicId } from "../commons/common-functions";

const userSchema = {
  _id: { type: String, default: generatePublicId, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isDeleted: { type: Boolean, required: true, default: false },
  isVerified: { type: Boolean, required: true, default: false },
  created_at: { type: String, required: true },
  updated_at: { type: String, default: "" },
};

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
