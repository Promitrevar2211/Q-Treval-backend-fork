import Joi from 'joi';

export const documentUploadValidation = Joi.object().keys({
  bucket_name: Joi.string().valid('din24-news').required()
})

