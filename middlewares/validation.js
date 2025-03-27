const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (
    validator.isURL(value, {
      protocols: ["http", "https"],
      require_protocol: true,
    })
  ) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
  }),
});

// 🎯 **2. Validate user info when a user is created**
module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    username: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "username" field is 2',
      "string.max": 'The maximum length of the "username" field is 30',
      "string.empty": 'The "username" field must be filled in',
    }),
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be a valid email address',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// 🎯 **3. Validate authentication when a user logs in**
module.exports.validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be a valid email address',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});
