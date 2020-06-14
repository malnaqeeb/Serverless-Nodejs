const dynamoDB = require("../../dynamodb");

module.exports.handler = async (event) => {
  const id = event.pathParameters.id;
  try {
    const results = await dynamoDB
      .get({
        TableName: process.env.LOAN_TABLE || "nodejs-assignment-dev-loan",
        Key: {
          id,
        },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(results.Item),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
