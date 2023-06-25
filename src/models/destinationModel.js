import mongoose from "mongoose";
import { generatePublicId } from "../commons/common-functions";

const { Schema } = mongoose;

const timeFrameSchema = new Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

const imageSchema = new Schema({
  url: { type: String, required: true },
  caption: { type: String, required: true },
});

const activitySchema = new Schema({
  activity: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const attractionSchema = new Schema({
  attraction: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const videoSchema = new Schema({
  url: { type: String, required: true },
  description: { type: String, required: true },
});

const destinationSchema = new Schema({
  _id: { type: String, required: true, default : generatePublicId},
  place: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  picode: { type: String, required: true },
  otherDetails: {
    bestTimeToVisit: [timeFrameSchema],
    travelTips: [String],
  },
  images: [imageSchema],
  popularActivities: [activitySchema],
  popularAttractions: [attractionSchema],
  videos: [videoSchema],
});

destinationSchema.index({ place: 1, city: 1, state: 1, country: 1 });

const Place = mongoose.model("Destination", destinationSchema);

export default Place;
