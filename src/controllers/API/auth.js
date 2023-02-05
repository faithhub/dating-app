require("dotenv").config();
const { User } = require("../../database/models");
const config = require("../../database/config/config.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const twilioVerify = require("../../ultis/twilio/verifyPhone");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

async function hashIt(password) {
  const salt = await bcrypt.genSalt(6);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}

async function login(req, res) {
  try {
    const { phone, password } = req.body;

    var user = await User.findOne({
      where: { phone },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.validPassword(password)) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    var user = await User.findOne({
      raw: true,
      nest: true,
      where: { phone },
    });

    const token = jwt.sign({ sub: user.phone, id: user.id }, config.secret, {
      expiresIn: "7d",
    });
    delete user.password;
    const data = { ...user, token };

    return res.status(200).json({
      message: "User logged in successfully",
      data: data,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occur",
      error: error.message,
    });
  }
}

async function register(req, res) {
  try {
    const { phone, password } = req.body;

    const checkPhone = await User.count({
      where: { phone },
    });

    if (checkPhone > 0) {
      return res.status(400).json({
        message: "The phone already exists",
      });
    }

    // const password = await hashIt(req.body.password);
    // const payload = {
    //   ...req.body,
    //   username: req.body.matric,
    //   type: "student",
    // };
    // delete payload.matric;
    // delete payload.confirmPassword;
    // console.log(payload);
    // const save = await User.create(payload);
    const createUser = await User.create({ phone, password });

    if (!createUser) {
      return res.status(400).json({
        message: "An error occur when creating a new User",
      });
    }

    return res.status(200).json({
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occur",
      error: error.message,
    });
  }
}

async function sendCode(req, res) {
  try {
    const { phone } = req.body;

    const sendCode = await twilioVerify.sendCode(phone);

    return res.status(200).json({
      message: "Code sent",
      data: sendCode,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occur",
      error: error.message,
    });
  }
}

async function verifyCode(req, res) {
  const { phone, code } = req.body;
  client.verify.v2
    .services(process.env.TWILIO_SID)
    .verificationChecks.create({ to: phone, code: code })
    .then((result) => {
      if (result.status == "approved") {
        res.status(200).json({
          message: "Code approved successfully",
          response: result.status,
        });
      } else {
        res.status(400).json({
          message: "Verification not successfully",
          response: result.status,
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(400).json({
        message: "An error occur",
        error: err.message,
      });
    });
}

module.exports = { login, register, sendCode, verifyCode };
