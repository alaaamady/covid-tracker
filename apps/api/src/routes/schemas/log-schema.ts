import Joi, { string } from 'joi';

export const logSchema = {
  findByUserId: Joi.object().keys({
    userId: Joi.string(),
  }),
  findAll: {},
  insert: Joi.object().keys({
    location: Joi.object().keys({
      type: Joi.string().valid('point'),
      coordinates: Joi.array().items(Joi.number()),
    }),
    temperature: Joi.number(),
  }),
};
