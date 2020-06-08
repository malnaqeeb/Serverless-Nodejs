const dynamoDB = require("../../dynamodb");
const Joi = require("joi");

const handleBalance = async (
  loan,
  requestBody,
  responseFromDisbursedFunction
) => {
  const data = await JSON.parse(requestBody);
  const schema = Joi.object().keys({
    payment: Joi.number().required(),
  });
  const { error } = Joi.validate(data, schema);
  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify("the error", error.details),
    };
  }

  // handling the response from hanldeDisbursed
  let updatedAmount;
  let updatedPayment;
  let updatedStatus;

  if (responseFromDisbursedFunction === "OPEN") {
    updatedAmount = loan.amount - data.payment;
    updatedStatus = "OPEN";
    updatedPayment = data.payment;
  } else if (responseFromDisbursedFunction === "FinalPayment") {
    updatedAmount = loan.amount - data.payment;
    updatedStatus = "FinalPayment";
    updatedPayment = loan.amount - data.payment;
  } else if (responseFromDisbursedFunction === "LoanDisbursed") {
    updatedAmount = loan.amount;
    updatedStatus = "LoanDisbursed";
    updatedPayment = 0;
  } else if (responseFromDisbursedFunction === "Exceed") {
    return {
      statusCode: 400,
      body: JSON.stringify(`Your payment should be equal or less than your balance: ${loan.amount}`),
    };
  }

  const params = {
    TableName: process.env.LOAN_TABLE,
    Key: {
      id: loan.id,
    },
    UpdateExpression:
      "SET amount= :amount, #status= :status, payment= :payment",
    ExpressionAttributeValues: {
      ":amount": updatedAmount,
      ":status": updatedStatus,
      ":payment": updatedPayment,
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
      body: results.Attributes,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

module.exports = handleBalance;
