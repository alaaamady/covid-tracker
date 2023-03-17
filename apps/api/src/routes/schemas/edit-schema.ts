import Joi from 'joi';

export const editSchema = {
  request: Joi.object().keys({
    name: Joi.string().required(),
  }),
};
