const Joi = require("joi");
const dynamoDB = require("../../dynamodb");
const findone = require("../handling/findone");

module.exports.handler = async (evenet) => {
  const data = JSON.parse(evenet.body);
  const id = evenet.pathParameters.id;
  const schema = Joi.object().keys({
    amount: Joi.number().required(),
  });

  const { error } = Joi.validate(data, schema);
  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.details),
    };
  }
  if (data.amount > 0) {
    const params = {
      TableName: process.env.LOAN_TABLE,
      Key: {
        id,
      },
      UpdateExpression: "SET amount= :amount, #status= :status",
      ExpressionAttributeValues: {
        ":amount": data.amount,
        ":status": "open",
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
        body: JSON.stringify(results.Attributes),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify(error),
      };
    }
  } 
};
