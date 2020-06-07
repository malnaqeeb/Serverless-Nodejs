const Lambda = require("aws-sdk/clients/lambda");
const findone = require("../handling/findone");
const handleStatus = require("../handling/handleStatus");
const handleBalance = require("../handling/handleBalance");
const checkBalance = require("../handling/checkBalance");

module.exports.handler = async (event, context, callback) => {
  let responseFromDisbursedFunction;
  const requestBody = await event.body;
  const id = event.pathParameters;
  const getDesiredLoan = await findone(id.id);
  const responseFromCheckBalance = await checkBalance(
    getDesiredLoan,
    requestBody
  );
  const commandToBeSend = responseFromCheckBalance.body;
  const lambda = new Lambda({ endpoint: process.env.INVOKE_ENDPOINT });
  const params = {
    FunctionName: process.env.INVOKE_FUNCTION,
    InvocationType: "RequestResponse",
    Payload: JSON.stringify({ msg: commandToBeSend }),
  };

  try {
    const lambdaInvokeResp = await lambda.invoke(params).promise();
    responseFromDisbursedFunction = lambdaInvokeResp.Payload;
  } catch (error) {
    console.error(error);
  }
  if (responseFromDisbursedFunction === "OPEN" || responseFromDisbursedFunction === "FinalPayment" ) {
    const result = await handleBalance(
      getDesiredLoan,
      requestBody,
      responseFromDisbursedFunction
    );
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } else if (responseFromDisbursedFunction === "LoanDisbursed" ) {
    const result = await handleStatus(
      getDesiredLoan,
      responseFromDisbursedFunction
    );
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  }else if (responseFromDisbursedFunction === "Exceed" ) {
    const result = await handleStatus(
      getDesiredLoan,
      responseFromDisbursedFunction
    );
    return {
      statusCode: 200,
      body: JSON.stringify('Your payment excced the balance'),
    };
  }
};
