const dynamoDB = require("../../dynamodb");

const findone = async (id) => {
  try {
    const results = await dynamoDB
      .get({
        TableName: process.env.LOAN_TABLE || "nodejs-assignment-dev-loan",
        Key: {
          id,
        },
      })
      .promise();

    return results.Item;
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};

module.exports = findone;
