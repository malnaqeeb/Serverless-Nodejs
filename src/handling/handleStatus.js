const dynamoDB = require("../../dynamodb");

const handleStatus = async (loan, res) => {
  const params = {
    TableName: process.env.LOAN_TABLE,
    Key: {
      id: loan.id,
    },
    UpdateExpression: "SET #status= :status",
    ExpressionAttributeValues: {
      ":status": res,
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ReturnValues: "ALL_NEW",
  };
  try {
    const results = await dynamoDB.update(params).promise();
    return {
      statusCode: 200,
      body: (results.Attributes),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

module.exports = handleStatus;
