const create = require("../../loan/create");
const validators = require("../testUtils/validators");
const eventGenerator = require("../testUtils/eventGenerator");
const { expect } = require("chai");

describe("create loan integration tests", () => {
  test("it should take a body and return an API Gateway response", async () => {
    const event = eventGenerator({
      body: { amount: 10 },
      pathParametersObject: {
        companyId: "rechtspersoon-12000192-ba-geurts-janssen-beheer-bv",
      },
    });
    const res = await create.handler(event);
    const body = JSON.parse(res.body);
    expect(validators.isApiGatewayResponse(res)).equal(true);
  });
  test("should return a 200 with loan if the company is active  ", async () => {
    const event = eventGenerator({
      body: { amount: 10 },
      pathParametersObject: {
        companyId: "rechtspersoon-12000192-ba-geurts-janssen-beheer-bv",
      },
    });
    const res = await create.handler(event);
    const body = JSON.parse(res.body);
    expect(res.statusCode).equal(200);
    expect(body.companyInfo.actief).equal(true);
    expect(validators.isApiGatewayResponse(res)).equal(true);
  });
});
