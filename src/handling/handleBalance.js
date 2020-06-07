const dynamoDB = require("../../dynamodb");
const Joi = require("joi");

const handleBalance = async (loan, requestBody, res) => {
  const data = await JSON.parse(requestBody);
  const schema = Joi.object().keys({
    payment: Joi.number().required(),
  });
  const { error } = Joi.validate(data, schema);
  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify('the error',error.details),
    };
  }
  const params = {
    TableName: process.env.LOAN_TABLE,
    Key: {
      id: loan.id,
    },
    UpdateExpression: "SET amount= :amount, #status= :status, payment= :payment",
    ExpressionAttributeValues: {
      ":amount": loan.amount - data.payment,
      ":status": res,
      ":payment": data.payment
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

module.exports = handleBalance;
