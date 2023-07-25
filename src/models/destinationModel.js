import mongoose from "mongoose";
import { generatePublicId } from "../commons/common-functions.js";

const { Schema } = mongoose;

const timeFrameSchema = new Schema({
  start: { type: Number, required: true },
  end: { type: Number, required: true },
});

const imageSchema = new Schema({
  url: { type: String, required: true },
  caption: { type: String, required: true },
});

const activitySchema = new Schema({
  activity: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: "" },
});

const attractionSchema = new Schema({
  attraction: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: "" },
});

const videoSchema = new Schema({
  url: { type: String, required: true },
  description: { type: String, required: true },
});

const destinationSchema = new Schema({
  _id: { type: String, required: true, default: generatePublicId },
  place: {
    type: String,
    required: true,
    unique: true,
  },
  city: { type: String, required: true },
  state: { type: String, default: "" },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
  otherDetails: {
    bestTimeToVisit: [timeFrameSchema],
    travelTips: [String],
  },
  images: [imageSchema],
  popularActivities: [activitySchema],
  popularAttractions: [attractionSchema],
  videos: [videoSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  isFeatured: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  taglines: { type: [String], default: [] },
  itinerary_plan_suggestions: { type: [String], default: [] },
});

destinationSchema.index({ place: 1, city: 1, state: 1, country: 1 });

const Place = mongoose.model("Destination", destinationSchema);

export default Place;
