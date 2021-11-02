'use strict';

module.exports.validateEnv = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'event to detect environments',
        input: `you are in the environment of ${event.pathParameters.env}`,
      },
      null,
      2
    ),
  };

}
