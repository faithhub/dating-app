const { check, validationResult } = require("express-validator");

exports.createTrans = [
  check("subId")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Subscription ID is required!"),
  check("duration")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Sub duration is required!"),
  check("message")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Transaction message is required!"),
  check("status")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Transaction status is required!"),
  check("trans")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Transaction trans is required!"),
  check("trxref")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Transaction trxref is required!"),
  (req, res, next) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
