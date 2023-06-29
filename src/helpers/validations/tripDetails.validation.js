import Joi from "joi";

export const createTripDetailsValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phoneNo: Joi.string().required(),
  destinationId: Joi.string().required(),
  travel_type: Joi.string().required().valid("One Way", "Return"),
  going_travel_date: Joi.string().required(),
  return_travel_date: Joi.string().when('travel_type', {
    is: "Return",
    then: Joi.required(),
    otherwise: Joi.forbidden()
  }),
  flight_type: Joi.string()
    .required()
    .valid("Economy", "Business", "First Class"),
  book_hotel: Joi.string().required().valid("Yes", "No"),
  place: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().optional().allow(""),
  country: Joi.string().required(),
});

export const updateTripDetailsValidation = Joi.object({
  tripId: Joi.string().required(),
  user_id: Joi.string().optional(),
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  phoneNo: Joi.string().optional(),
  destinationId: Joi.string().optional(),
  travel_type: Joi.string().optional().valid("One Way", "Return"),
  going_travel_date: Joi.string().optional(),
  return_travel_date: Joi.string().optional(),
  flight_type: Joi.string()
    .optional()
    .valid("Economy", "Business", "First Class"),
  book_hotel: Joi.string().optional().valid("Yes", "No"),
  place: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional(),
});
