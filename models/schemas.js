const Joi = require("@hapi/joi");

const userSchema = {
  name: Joi.string()
    .max(255)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),
  stripe: Joi.string(),
  notifications_sent: Joi.number()
    .integer()
    .min(0)
    .required(),
};
const organizationsSchema = {
  name: Joi.string()
      .max(255)
      .required(),
};

const classMemberSchema = {
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string()
      .email({ minDomainSegments: 2 })
      .allow(""),
  phone_number: Joi.string(),
  slack_uuid: Joi.string()
      .token()
      .allow(""),
  class_id: Joi.number()
      .integer()
      .min(1)
      .allow(null),
};
const classSchema = {
  title: Joi.string().required(),
};

const trainingSeriesSchema = {
  title: Joi.string().required(),
  country: Joi.string().required(),
};

const messageSchema = {
  subject: Joi.string().required(),
  body: Joi.string().required(),
  link: Joi.string()
    .uri({})
    .allow(""),
  training_series_id: Joi.number()
    .integer()
    .min(1)
    .required(),
  status: Joi.number().integer().min(0),
  for_manager: Joi.boolean(),
  for_class: Joi.boolean(),
  for_class_member: Joi.boolean(),
  days_from_start: Joi.number()
    .integer()
    .min(1)
    .required()
    .allow(null) //come back to this
};

const tokenSchema = {
  expiration: Joi.date().iso(),
  auth_token: Joi.string()
    .token()
    .required(),
  refresh_token: Joi.string().token(),
  service_id: Joi.number()
    .integer()
    .min(1)
    .required(),
  user_id: Joi.number()
    .integer()
    .min(1)
    .required()
};

const notificationSchema = {
  message_id: Joi.number()
    .integer()
    .min(1)
    .required(),
  service_id: Joi.number()
    .integer()
    .min(1)
    .required(),
  team_member_id: Joi.number()
    .integer()
    .min(1)
    .required(),
  send_date: Joi.date()
    .iso()
    .required(),
  is_sent: Joi.boolean(),
  num_attempts: Joi.number()
    .integer()
    .min(0),
  thread: Joi.string(),
  recipient_id: Joi.number()
    .integer()
    .min(1)
};

const responseSchema = {
  body: Joi.string(),
  notification_id: Joi.number()
    .integer()
    .min(1)
    .required(),
  created_at: Joi.date().timestamp() //defaults to "javascript", might need to pass in "unix" option
};

module.exports = {
  userSchema,
  classMemberSchema,
  classSchema,
  trainingSeriesSchema,
  messageSchema,
  tokenSchema,
  notificationSchema,
  responseSchema,
  organizationsSchema
};
