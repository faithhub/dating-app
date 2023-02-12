require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// Get friendlyName
// client.verify.v2.services
//   .create({ friendlyName: process.env.TWILIO_APP_NAME })
//   .then((service) => console.log(service.sid, service));

async function sendCode(phone) {
  const send = await client.verify.v2
    .services(process.env.TWILIO_SID)
    .verifications.create({ to: phone, channel: "sms" });
  return send;
}

async function verifyCode(phone, code) {
  // return await client.verify.v2
  //   .services(process.env.TWILIO_SID)
  //   .verificationChecks.create({ to: phone, code: code });
  // .then((verification_check) => {
  //   console.log(verification_check);
  // });
}

module.exports = { sendCode, verifyCode };
