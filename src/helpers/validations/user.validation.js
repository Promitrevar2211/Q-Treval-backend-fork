import Joi from "joi";

export const createUserValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  isAdmin : Joi.boolean().optional()
});

export const updateUserValidation = Joi.object({
  userId: Joi.string().required(),
  name: Joi.string().required(),
});

export const loginUserValidation = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
