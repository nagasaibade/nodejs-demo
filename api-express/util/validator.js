const status = require('http-status-codes');
const logger = require('./logger');
const customerSchema = require('../schema/customer');

const validator = (req, res, next) => {
  // Check request URL and validate schema
  if (req.method === 'POST') {
    const validation = customerSchema.postCustomer.validate(req.body);
    if (validation.error) {
      logger.error(JSON.stringify(validation));
      res.status(status.BAD_REQUEST).send({ message: 'Invalid request body' });
    } else {
      next();
    }
  }
};

module.exports = validator;
