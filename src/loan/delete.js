const dynamoDB = require("../dynamodb");

module.exports.handler = async (event) => {
  const id = event.pathParameters.id;
  try {
     await dynamoDB.delete({
      TableName: process.env.LOAN_TABLE,
      Key: {
        id,
      },
    }).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({msg: `Loan with id ${id} has been totally deleted`}),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
