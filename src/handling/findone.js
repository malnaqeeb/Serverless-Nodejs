const dynamoDB = require("../../dynamodb");

// module.exports.handler = async (id) => {
const findone = async (id) => {
  // const id = event.pathParameters.id;
  try {
    const results = await dynamoDB
      .get({
        TableName: process.env.LOAN_TABLE,
        Key: {
          id,
        },
      })
      .promise();

    return  results.Item
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};

module.exports = findone;
