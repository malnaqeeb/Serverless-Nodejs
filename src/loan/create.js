const Joi = require("joi");
const dynamoDB = require("../../dynamodb");
const axios = require("axios");
const OFFERED = "offered";

module.exports.handler = async (event) => {
  const data = await JSON.parse(event.body);
  const timestamp = new Date();
  const schema = Joi.object().keys({
    amount: Joi.number().required(),
    payment: Joi.number(),
  });
  const { error } = Joi.validate(data, schema);
  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.details),
    };
  }

  const companyId = event.pathParameters.companyId;

  let companyInfo;
  try {
    const res = await axios.get(
      `https://api.overheid.io/openkvk/${companyId}`,
      {
        headers: {
          "ovio-api-key":
            "52aed29a2fc3fc3241c53f07afe5d4a66f08f9c9ed5546cb7265524d44bd538d",
        },
      }
    );
    companyInfo = res.data;
  } catch (error) {
    console.log(error.message);
  }

  if (!companyInfo.actief) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: "Sorry!! This company is not active. Loan con not be offered ",
      }),
    };
  }

  const params = {
    TableName: process.env.LOAN_TABLE || "nodejs-assignment-dev-loan",
    Item: {
      id: companyId,
      amount: data.amount,
      status: OFFERED,
      offeredAt: timestamp.toISOString(),
      updatedAt: timestamp.toISOString(),
      payment: data.payment,
      companyInfo,
    },
  };
  try {
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
