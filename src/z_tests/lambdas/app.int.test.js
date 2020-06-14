const app = require("../../loan/app");
const findById = require("../../loan/findById");
const validators = require("../testUtils/validators");
const eventGenerator = require("../testUtils/eventGenerator");
const { expect } = require("chai");

describe("Should invoke function and disburse the loan", () => {
  test("it should take a body and return an API Gateway response", async () => {
    const event = eventGenerator({
      body: { payment: 3 },
      pathParametersObject: {
        id: "rechtspersoon-12000192-ba-geurts-janssen-beheer-bv",
      },
    });
    const res = await app.handler(event);
    const body = JSON.parse(res.body);
    expect(validators.isApiGatewayResponse(res)).equal(true);
  });
  test("it should take a body and return an API Gateway response", async () => {
    const event = eventGenerator({
      body: { payment: 11 },
      pathParametersObject: {
        id: "rechtspersoon-12000192-ba-geurts-janssen-beheer-bv",
      },
    });
    // get data of payment, loan and the balance
    const paymentBody = await JSON.parse(event.body);

    const getLoan = await findById.handler(event);
    const loanBody = await JSON.parse(getLoan.body);

    const invokeFunc = await app.handler(event);
    const invokeFuncBody = await JSON.parse(invokeFunc.body);

    const loan = loanBody.amount;
    const payment = paymentBody.payment;
    const balance = invokeFuncBody.body.amount;

    // start testing

    if (loan > 0 && loan - payment > 0) {
      expect(loan - payment).equal(balance);
    }
    if (loan - payment > 0) {
      expect(invokeFuncBody.body.status).equal("OPEN");
    }
    if (loan - payment === 0) {
      expect(invokeFuncBody.body.status).equal("FinalPayment");
    }
    if (loan - payment < 0 && loan !== 0) {
      expect(invokeFuncBody.statusCode).equal(400);
    }
    if (loan === 0) {
      expect(invokeFuncBody.body.status).equal("LoanDisbursed");
    }
  });
});
