import Joi from "joi";

export const createTripDetailsValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phoneNo: Joi.string().required(),
  from: Joi.string().optional(),
  destination: Joi.string().required(),
  no_of_travellers: Joi.alternatives()
    .try(Joi.string().pattern(/^[1-9][0-9]*$/), Joi.number().integer().min(1))
    .default(1)
    .optional(),
  travel_type: Joi.string().required().valid("One Way", "Return"),
  going_travel_date: Joi.string().required(),
  return_travel_date: Joi.string()
    .when("travel_type", {
      is: "Return",
      then: Joi.required(),
    })
    .when("travel_type", {
      is: Joi.not("Return"),
      then: Joi.optional().allow(null),
    }),
  flight_type: Joi.string()
    .required()
    .valid("Economy", "Business", "First Class"),
  book_hotel: Joi.string().required().valid("Yes", "No"),
});

export const updateTripDetailsValidation = Joi.object({
  tripId: Joi.string().required(),
  user_id: Joi.string().optional(),
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  phoneNo: Joi.string().optional(),
  destination: Joi.string().optional(),
  // destinationId: Joi.string().optional(),
  travel_type: Joi.string().optional().valid("One Way", "Return"),
  going_travel_date: Joi.string().optional(),
  return_travel_date: Joi.string().optional(),
  flight_type: Joi.string()
    .optional()
    .valid("Economy", "Business", "First Class"),
  book_hotel: Joi.string().optional().valid("Yes", "No"),
  // place: Joi.string().optional(),
  // city: Joi.string().optional(),
  // state: Joi.string().optional(),
  // country: Joi.string().optional(),
});
