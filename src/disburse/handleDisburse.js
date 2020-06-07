module.exports.handler = (event, context, callback) => {
  let sendBackMsg =
    event.msg === "DisburseLoan"
      ? "LoanDisbursed"
      : event.msg === "OPEN"
      ? "OPEN"
      : event.msg === "FinalPayment"
      ? "FinalPayment"
      : "Exceed";
  callback(null, sendBackMsg);
};
