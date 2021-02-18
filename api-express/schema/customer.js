const joi = require('@hapi/joi');

const postCustomer = joi.object({
  username: joi.string().alphanum().min(3).max(30),
  password: joi.string(),
});

module.exports.postCustomer = postCustomer;
