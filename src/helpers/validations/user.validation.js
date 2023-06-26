import Joi from "joi";

export const createUserValidation = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  gender: Joi.string().required(),
  dob : Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  isAdmin: Joi.boolean().optional(),
});

export const updateUserValidation = Joi.object({
  userId: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().optional(),
  gender : Joi.string().optional(),
  dob : Joi.string().optional()
});

export const loginUserValidation = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
