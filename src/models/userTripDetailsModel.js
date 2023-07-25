import mongoose from "mongoose";
import { generatePublicId } from "../commons/common-functions.js";

const tripDetailsSchema = {
  _id: { type: String, default: generatePublicId, required: true },
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNo: { type: String, required: true },
  from: { type: String, required: false, default: "" },
  destination: { type: String, required: true },
  no_of_travellers: { type: Number, required: true, default: 1 },
  notes: { type: Array, default: []},
  travel_type: {
    type: String,
    required: true,
    enum: ["One Way", "Return"],
    default: "One Way",
  },
  going_travel_date: { type: Date, required: true },
  return_travel_date: { type: Date, default: null },
  flight_type: {
    type: String,
    required: true,
    enum: ["Economy", "Business", "First Class"],
    default: "Economy",
  },
  book_hotel: {
    type: String,
    required: true,
    enum: ["Yes", "No"],
    default: "Yes",
  },
  isDeleted: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
};

const tripDetailsModel = mongoose.model("userTripDetails", tripDetailsSchema);

export default tripDetailsModel;
