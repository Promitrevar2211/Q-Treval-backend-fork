import mongoose from "mongoose";
import { generatePublicId } from "../commons/common-functions.js";

const userSchema = {
  _id: { type: String, default: generatePublicId, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: {
    type: String,
    required: true,
    default: 'Male',
    enum: ['Male', 'Female'],
  },
  dob: { type: Date, default: Date.now, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isDeleted: { type: Boolean, required: true, default: false },
  isVerified: { type: Boolean, required: true, default: false },
  notifications: {type: Array, default:[]},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
};

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
