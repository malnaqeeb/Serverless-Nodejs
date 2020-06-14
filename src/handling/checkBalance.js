const Joi = require("joi");

const checkBalance = async (loan, requestBody) => {
  const data = requestBody;
  const schema = Joi.object().keys({
    payment: Joi.number().required(),
  });
  const { error } = Joi.validate(data, schema);
  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.details),
    };
  }
  if (loan.amount === 0) {
    return {
      statusCode: 200,
      body: "DisburseLoan",
    };
  } else if (loan.amount - data.payment > 0) {
    return {
      body: "OPEN",
    };
  } else if (loan.amount - data.payment === 0) {
    return {
      body: "FinalPayment",
    };
  } else if (loan.amount - data.payment < 0) {
    return {
      body: "Exceed",
    };
  }
};
module.exports = checkBalance;
