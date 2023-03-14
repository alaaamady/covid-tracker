import Joi from 'joi';

export const editSchema = {
  response: Joi.object().keys({
    created_at: Joi.date(),
    email: Joi.string(),
    email_verified: Joi.boolean(),
    identities: Joi.array(),
    name: Joi.string(),
    nickname: Joi.string(),
    picture: Joi.string(),
    updated_at: Joi.date(),
    user_id: Joi.string(),
    last_ip: Joi.string(),
    last_login: Joi.date(),
    logins_count: Joi.number(),
  }),
  request: Joi.object().keys({
    userId: Joi.string().required(),
    name: Joi.string().required(),
  }),
};
