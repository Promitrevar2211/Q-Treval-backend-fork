import Joi from "joi";

export const createMemberValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  isAdmin : Joi.boolean().optional()
});

export const updateMemberValidation = Joi.object({
  memberId: Joi.string().required(),
  name: Joi.string().required(),
});

export const loginMemberValidation = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
