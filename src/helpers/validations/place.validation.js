import Joi from "joi";

const timeFrameSchema = Joi.object({
  start: Joi.number().required(),
  end: Joi.number().required()
});

const imageSchema = Joi.object({
  url: Joi.string().required(),
  caption: Joi.string().required()
});

const activitySchema = Joi.object({
  activity: Joi.string().required(),
  description: Joi.string().required(),
  imageUrl: Joi.string().default("")
});

const attractionSchema = Joi.object({
  attraction: Joi.string().required(),
  description: Joi.string().required(),
  imageUrl: Joi.string().default("")
});

const videoSchema = Joi.object({
  url: Joi.string().required(),
  description: Joi.string().required()
});

export const createPlaceValidation = Joi.object({
  place: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().optional().allow(""),
  country: Joi.string().required(),
  pincode: Joi.string().required(),
  otherDetails: Joi.object({
    bestTimeToVisit: Joi.array().items(timeFrameSchema),
    travelTips: Joi.array().items(Joi.string())
  }),
  images: Joi.array().items(imageSchema),
  popularActivities: Joi.array().items(activitySchema),
  popularAttractions: Joi.array().items(attractionSchema),
  videos: Joi.array().items(videoSchema),
  created_at: Joi.date().default(Date.now),
  updated_at: Joi.date().default(Date.now),
  isFeatured: Joi.number().default(0)
});