import Joi from 'joi';

export const logSchema = {
  findByUserId: Joi.object().keys({
    userId: Joi.string(),
  }),
  findAll: {},
  insert: Joi.object().keys({
    location: Joi.object().keys({
      type: Joi.string().valid('Point'),
      coordinates: Joi.array().items(Joi.number()),
    }),
    temperature: Joi.number(),
  }),
};
