const fs = require('fs');
const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const parameters = require('./config.json');
const logger = require('./logger');

// Define .env file path
const envPath = './.env';

const getParametersFromStore = async (parameter, ssm) => {
  // Get parameter from SSM
  const params = {
    Name: `/${process.env.NODE_ENV}/${process.env.APP_NAME}/${parameter}`,
    WithDecryption: true,
  };

  const paramObject = await ssm.getParameter(params).promise();

  // Return parameter string to be placed in .env file
  return `${parameter}=${paramObject.Parameter.Value}`;
};

const initializeParameters = async () => {
  // Check environment
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'staging'
  ) {
    try {
      // Initialize AWS SSM from SDK
      AWS.config.update({ region: 'us-east-1' });
      const ssm = new AWS.SSM();

      // Delete any existing .env files
      if (fs.existsSync(envPath)) {
        fs.unlinkSync(envPath);
      }

      // Create .env file from SSM parameter store
      Promise.all(
        parameters.map(async (parameter) => {
          // Get parameter string from SSM parameter store
          const paramValue = await getParametersFromStore(parameter, ssm);

          // Append parameter string into .env file
          fs.appendFileSync(envPath, `${paramValue}\n`);
        })
        // eslint-disable-next-line no-unused-vars
      ).then((result) => {
        // Load environment variables from .env file
        dotenv.config();

        // Delete .env file
        fs.unlinkSync(envPath);
      });
    } catch (error) {
      logger.error(error);
    }
  } else {
    // Load environment variables from .env file
    dotenv.config();
  }

  return true;
};

module.exports.initializeParameters = initializeParameters;
