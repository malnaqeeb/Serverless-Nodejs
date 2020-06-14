const isApiGatewayResponse = (response) => {
  const { body, statusCode } = response;

  if (!body || !statusCode) return false;
  if (typeof statusCode !== "number") return false;
  if (typeof body !== "string") return false;
  return true;
};
module.exports = {
  isApiGatewayResponse,
};
